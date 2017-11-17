const assert = require('assert');

describe('Transaction', () => {
  const Transaction = require('../../lib/transaction');
  const { MemoryGate, BufferGate } = require('../../lib/gate');

  describe('#run', () => {
    it('works rightly', async () => {
      const input = new MemoryGate([{ val: 1 }, { val: 2 }]);
      const output = new MemoryGate();

      const transaction = new Transaction(input, output);
      transaction.main = async (item) => {
        item.val *= 3;
        item.done = true;
        return item;
      };

      await transaction.run();
      assert.deepEqual(output.data, [
        { val: 3, done: true },
        { val: 6, done: true }
      ]);
    });
  });

  describe('#create', () => {
    it('returns a transaction instance and it works rightly', async () => {
      const input = new MemoryGate([{ val: 1 }, { val: 2 }]);
      const output = new MemoryGate();

      const transaction = Transaction.create(input, output, async (item) => {
        item.val -= 1;
        item.done = true;
        return item;
      });

      await transaction.run();
      assert.deepEqual(output.data, [
        { val: 0, done: true },
        { val: 1, done: true }
      ]);
    });
  });

  describe('#start', () => {
    class Value3times extends Transaction {
      async main(item) {
        item.val *= 3;
        return item;
      }
    }

    class SetDoneFalse extends Transaction {
      async main(item) {
        item.done = false;
        return item;
      }
    }

    it('proceeds transactions', async () => {
      const input = new MemoryGate([{ val: 1 }, { val: 2 }]);
      const output = new MemoryGate();
      const joint = new BufferGate();

      await Transaction.start(
        new Value3times(input, joint),
        new SetDoneFalse(joint, output),
      )
      assert.deepEqual(output.data, [
        { val: 3, done: false },
        { val: 6, done: false }
      ]);
    });

    it('proceeds transactions without the order of start args', async () => {
      const input = new MemoryGate([{ val: 1 }, { val: 2 }]);
      const output = new MemoryGate();
      const joint = new BufferGate();

      await Transaction.start(
        new SetDoneFalse(joint, output),
        new Value3times(input, joint),
      )
      assert.deepEqual(output.data, [
        { val: 3, done: false },
        { val: 6, done: false }
      ]);
    });
  });
});
