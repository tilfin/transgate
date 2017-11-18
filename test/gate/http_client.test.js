const assert = require('assert');

const HttpClientGate = require('../../lib/gate/http_client');
const HttpServerGate = require('../../lib/gate/http_server');

describe('HttpClientGate', () => {

  describe('#send', () => {
    const item = { a: 1, b: 'str' };

    it('posts items server and the gate returns them', async () => {
      const cgate = new HttpClientGate({
        endpoint: 'http://localhost:18000/'
      });

      const sgate = new HttpServerGate();

      await Promise.all([
        (async () => {
          await cgate.send(item);
          await cgate.send(null);
        })(),
        (async () => {
          const result1 = await sgate.receive();
          const result2 = await sgate.receive();
          assert.deepEqual(result1, item);
          assert.equal(result2, null);
        })(),
      ]);
    })
  })

})
