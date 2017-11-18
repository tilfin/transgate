const assert = require('assert');

describe('Transaction', () => {
  const Transaction = require('../../lib/transaction');
  const { JointGate, MemoryGate } = require('../../lib/gate');

  describe('#run', () => {
    it('works main that returns the result', async () => {
      const ingate = new MemoryGate([{ val: 1 }, { val: 2 }]);
      const outgate = new MemoryGate();

      const transaction = new Transaction(ingate, outgate);
      transaction.main = async (item) => {
        item.val *= 3;
        item.done = true;
        return item;
      };

      await transaction.run();
      assert.deepEqual(outgate.data, [
        { val: 3, done: true },
        { val: 6, done: true }
      ]);
    })

    it('works main that writes the result to outgate', async () => {
      const ingate = new MemoryGate([{ val: 1 }, { val: 2 }]);
      const outgate = new MemoryGate();

      const transaction = new Transaction(ingate, outgate);
      transaction.main = async (item, outgate) => {
        item.val *= 5;
        item.done = true;
        outgate.send(item);
      };

      await transaction.run();
      assert.deepEqual(outgate.data, [
        { val: 5, done: true },
        { val: 10, done: true }
      ]);
    })
  })

  describe('#create', () => {
    it('returns a transaction instance and it works rightly', async () => {
      const ingate = new MemoryGate([{ val: 1 }, { val: 2 }]);
      const outgate = new MemoryGate();

      const transaction = Transaction.create(ingate, outgate, async (item) => {
        item.val -= 1;
        item.done = true;
        return item;
      });

      await transaction.run();
      assert.deepEqual(outgate.data, [
        { val: 0, done: true },
        { val: 1, done: true }
      ]);
    })
  })

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
      const ingate = new MemoryGate([{ val: 1 }, { val: 2 }]);
      const outgate = new MemoryGate();
      const joint = new JointGate();

      await Transaction.start(
        new Value3times(ingate, joint),
        new SetDoneFalse(joint, outgate),
      )
      assert.deepEqual(outgate.data, [
        { val: 3, done: false },
        { val: 6, done: false }
      ]);
    })

    it('proceeds transactions without the order of start args', async () => {
      const ingate = new MemoryGate([{ val: 1 }, { val: 2 }]);
      const outgate = new MemoryGate();
      const joint = new JointGate();

      await Transaction.start(
        new SetDoneFalse(joint, outgate),
        new Value3times(ingate, joint),
      )
      assert.deepEqual(outgate.data, [
        { val: 3, done: false },
        { val: 6, done: false }
      ]);
    })
  })

})
