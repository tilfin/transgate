import URL from 'url'
import { GateItem, OutGate } from './type'

/**
 * HTTP client Gate for Output
 */
export class HttpClientGate<T extends GateItem> implements OutGate<T> {
  private _client: any
  private _params: any

  /**
   * @param {string} options.endpoint - endpoint URL
   * @param {string} options.method   - request method
   * @param {object} options.headers  - request headers
   */
  constructor(options: any = {}) {
    const endpoint = URL.parse(options.endpoint || 'http://localhost:18000/');
    const method = options.method || 'POST';
    const port = Number(endpoint.port);
    const { protocol, hostname, path } = endpoint;
    const headers = options.headers || {};

    this._client = require(protocol === 'https:' ? 'https' : 'http');
    this._params = { hostname, port, method, path, headers };
  }

  /**
   * @param  {object} item - sending item
   * @return {Promise} - a promise that resolves when the item has been sended
   */
  send(item: T): Promise<void> {
    const params = this._params;
    let body: string;

    if (item !== null) {
      try {
        body = JSON.stringify(item);
        params.headers['Content-Type'] = 'application/json;charset=utf8';
        params.headers['Content-Length'] = Buffer.byteLength(body);
      } catch(e) {
        return Promise.reject(e);
      }
    } else {
      body = '';
      params.headers['Content-Type'] = 'text/plain';
      params.headers['Content-Length'] = 0;
    }

    return new Promise((resolve, reject) => {
      const req = this._client.request(params, (res: any) => {
        res.setEncoding('utf8');
        res.on('error', reject);

        let resBody: string = '';
        res.on('data', (chunk: string) => {
          resBody += chunk;
        });
        res.on('end', () => {
          console.log(resBody)
          resolve()
        });
      });

      req.on('error', reject);
      req.write(body);
      req.end();
    });
  }
}
