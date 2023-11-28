const url = require('node:url');
const http = require('node:http');
const path = require('node:path');
const fs = require('node:fs');
const LimitSizeStream = require('./LimitSizeStream');

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'POST':
      let buffer = Buffer.alloc(0);

      fs.access(filepath, fs.constants.F_OK, err => {
        if (err) {
          const limitstream = new LimitSizeStream({ limit: 1024 * 1024 });
          const filterStream = req.pipe(limitstream);

          if (pathname.split('/').length > 1) {
            res.statusCode = 400;
            res.end('Invalid path');
          }

          filterStream.on('data', chunk => {
            buffer = Buffer.concat([buffer, chunk]);
          });

          filterStream.on('error', err => {
            res.statusCode = 413;
            res.end(err.message);
            return;
          });

          filterStream.on('end', () => {
            if (buffer.length === 0) {
              res.statusCode = 409;
              res.end('Body is empty');
              return;
            }

            const writeFile = fs.createWriteStream(filepath);
            writeFile.end(buffer);
            res.statusCode = 201;
            res.end('The file was recorded');
            return;
          });

          return;
        }

        res.statusCode = 409;
        res.end('File exists');
      });
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
