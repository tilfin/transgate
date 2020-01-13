import http from 'http'

import { ItemBuffer } from './buffer'
import { GateItem, InGate } from './type'

/**
 * HTTP server Gate for Input
 */
export class HttpServerGate<T extends GateItem> implements InGate<T> {

  private _buffer: ItemBuffer<T>
  private _server: http.Server | null

  /**
   * @param {number} options.port - listen port
   * @param {string} options.host - bind host
   */
  constructor(options: any = {}) {
    const { port=18000, host } = options;

    this._buffer = new ItemBuffer();

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

  /**
   * @return {http.Server} - HTTP server instance
   */
  get server() {
    return this._server;
  }

  /**
   * @return {Promise<object>} - A promise that resolves the item when recevied
   */
  async receive(): Promise<T | null> {
    const entry = await this._buffer.read();
    if (entry === null) {
      await this.close();
      return null;
    }
    return entry;
  }

  /**
   * Close HTTP server
   * @return {Promise} - A promise that resolves server closed
   */
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
