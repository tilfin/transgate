const assert = require('assert');
const MemoryGate = require('../../lib/gate/memory');

describe('MemoryGate', () => {

  describe('#receive', () => {
    it('returns initial data', async () => {
      const t = new MemoryGate([{ a: 1 }, { a: 2 }]);
      assert.deepEqual(await t.receive(), { a: 1 });
      assert.deepEqual(await t.receive(), { a: 2 });
      assert.equal(await t.receive(), null);
    })
  })

  describe('#send', () => {
    it('appends data', async () => {
      const t = new MemoryGate();
      await t.send({ a: 1 });
      await t.send({ a: 2 });
      assert.deepEqual(t.data, [{ a: 1 }, { a: 2 }]);
    })
  })

})
