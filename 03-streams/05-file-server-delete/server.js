const url = require('url');
const { Server } = require('http');
const path = require('path');
const fs = require('node:fs');

const server = new Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'DELETE':
      fs.access(filepath, fs.constants.F_OK, err => {
        if (pathname.split('/').length > 1) {
          res.statusCode = 400;
          res.end('Invalid path');
          return;
        }

        if (err) {
          res.statusCode = 404;
          res.end('File not found');
          return;
        }

        fs.unlink(filepath, () => {
          res.statusCode = 200;
          res.end('File deleted');
        });
      });
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
