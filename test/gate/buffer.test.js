const assert = require('assert');

describe('BufferGate', () => {
  const BufferGate = require('../../lib/gate/buffer');

  describe('#write', () => {
    const item1 = { a: 1 };
    const item2 = { b: 2 };

    it('appends data', async () => {
      const gate = new BufferGate();
      await gate.write(item1);
      await gate.write(item2);
      assert.deepEqual(gate.data, [item1, item2]);
    });
  });

  describe('#read before #write', () => {
    const item = { rw: 1 };

    it('reads an written item via polling', (done) => {
      const gate = new BufferGate();

      gate.read().then(result => {
        assert.deepEqual(result, item);
        done();
      });

      gate.write(item);
    });
  });

  describe('#write and #read', () => {
    const item = { wr: 1 };

    it('passes an item', (done) => {
      const gate = new BufferGate();

      gate.write(item);
      
      gate.read().then(result => {
        assert.deepEqual(result, item);
        done();
      });
    });
  });
});
