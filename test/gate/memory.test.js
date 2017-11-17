const assert = require('assert');

describe('MemoryGate', () => {
  const MemoryGate = require('../../lib/gate/memory');

  describe('#read()', () => {
    it('reads initial data', async () => {
      const t = new MemoryGate([{ a: 1 }, { a: 2 }]);
      assert.deepEqual(await t.read(), { a: 1 });
      assert.deepEqual(await t.read(), { a: 2 });
      assert.equal(await t.read(), null);
    });
  });

  describe('#write()', () => {
    it('appends data', async () => {
      const t = new MemoryGate();
      await t.write({ a: 1 });
      await t.write({ a: 2 });
      assert.deepEqual(t.data, [{ a: 1 }, { a: 2 }]);
    });
  });
});
