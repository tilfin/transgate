const assert = require('assert');
const request = require('supertest');

const HttpServerGate = require('../../lib/gate/http_server');

describe('HttpServerGate', () => {

  describe('#receive', () => {
    const item = { a: 1, b: 'str' };

    it('appends data', async () => {
      const gate = new HttpServerGate({ port: 18001 });
      await Promise.all([
        (async () => {
          const result1 = await gate.receive();
          const result2 = await gate.receive();
          assert.deepEqual(result1, item);
          assert.equal(result2, null);
        })(),
        (async () => {
          await request(gate.server)
            .post('/').type('json').send(item)
            .expect(204);
          await request(gate.server)
            .post('/')
            .expect(204);
        })()
      ]);
    })
  })

})
