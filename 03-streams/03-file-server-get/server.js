const url = require('url');
const { Server } = require('http');
const path = require('path');
const fs = require('node:fs');

const server = new Server();

server.on('request', (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathname = url.pathname.slice(1);

    const filepath = path.join(__dirname, 'files', pathname);
    const readFile = fs.createReadStream(filepath);

    switch (req.method) {
        case 'GET':
            readFile.pipe(res);

            readFile.on('error', err => {
                if (err.code === 'ENOENT') {
                    if (pathname.split('/').length > 1) {
                        res.statusCode = 400;
                        return res.end('Invalid path');
                    }

                    res.statusCode = 404;
                    return res.end('Page not found');
                }

                res.statusCode = 500;
                res.end('Internal Server Error');
            });

            break;

        default:
            res.statusCode = 501;
            res.end('Not implemented');
    }
});

module.exports = server;
