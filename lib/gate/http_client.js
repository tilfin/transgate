const URL  = require('url');

/**
 * HTTP client Gate for Output
 */
class HttpClientGate {

  /**
   * @param {string} options.endpoint - endpoint URL
   * @param {string} options.method   - request method
   * @param {object} options.headers  - request headers
   */
  constructor(options) {
    const opts = options || {};

    const endpoint = URL.parse(opts.endpoint || 'http://localhost:18000/');
    const method = opts.method || 'POST';
    const port = Number(endpoint.port);
    const { protocol, hostname, path } = endpoint;
    const headers = opts.headers || {};

    this._client = require(protocol === 'https:' ? 'https' : 'http');
    this._params = { hostname, port, method, path, headers };
  }

  /**
   * @param  {object} item - sending item
   * @return {Promise} - a promise that resolves when the item has been sended
   */
  send(item) {
    const params = this._params;
    let body;

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
      const req = this._client.request(params, res => {
        res.setEncoding('utf8');
        res.on('error', reject);

        let resBody = '';
        res.on('data', (chunk) => {
          resBody += chunk;
        });
        res.on('end', resolve);
      });

      req.on('error', reject);
      req.write(body);
      req.end();
    });
  }
}

module.exports = HttpClientGate;
