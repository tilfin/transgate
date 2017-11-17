const http = require('http');
const URL  = require('url');

const BufferGate = require('./buffer');

class HttpServerGate {

  constructor(options) {
    const opts = options || {};
    const { port=18000, host } = opts;

    this._buffer = new BufferGate();

    this._server = http.createServer((req, res) => {
      if (req.method === 'POST' || req.method == 'PUT') {
        let body = '';
        req.on('data', data => {
          body += data;
        }).on('end', () => {
          if (body.length === 0) {
            this._buffer.write(null);
            res.writeHead(204);
            res.end();
            return;
          }

          try {
            const item = JSON.parse(body);
            this._buffer.write(item);
            res.writeHead(204);
            res.end();
          } catch(e) {
            console.error(e)
            res.writeHead(422, { 'Content-Length': 0 });
            res.end();
          }
        });
      } else {
        res.writeHead(405, { 'Content-Length': 0 });
        res.end();
      }
    });

    this._server.listen(port, host);
  }

  get server() {
    return this._server;
  }

  async read() {
    const entry = await this._buffer.read();
    if (entry === null) {
      await this.close();
      return null;
    }
    return entry;
  }

  close() {
    const svr = this._server;
    if (svr) {
      this._server = null;
      return new Promise((resolve) => {
        svr.close(resolve);
      });
    } else {
      return Promise.resolve();
    }
  }
}

module.exports = HttpServerGate;
