const assert = require('assert');

describe('HttpClientGate', () => {
  const HttpClientGate = require('../../lib/gate/http_client');
  const HttpServerGate = require('../../lib/gate/http_server');

  describe('#write', () => {
    const item = { a: 1, b: 'str' };

    it('posts items server and the gate returns them', async () => {
      const cgate = new HttpClientGate({
        endpoint: 'http://localhost:18000/'
      });

      const sgate = new HttpServerGate();

      await Promise.all([
        (async () => {
          await cgate.write(item);
          await cgate.write(null);
        })(),
        (async () => {
          const result1 = await sgate.read();
          const result2 = await sgate.read();
          assert.deepEqual(result1, item);
          assert.equal(result2, null);
        })(),
      ]);
    });
  });
});
