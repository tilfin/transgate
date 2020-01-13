const assert = require('assert')

const { Agent, Duplicator, duplicator, MemoryGate } = require('../../dist')

describe('Duplicator', () => {
  describe('#new', () => {
    it('creates a Duplicator and copy-distributes an item to gates for Output', async () => {
      const inGate = new MemoryGate([{ val: 1 }, { val: 2 }]);
      const outGate1 = new MemoryGate();
      const outGate2 = new MemoryGate();

      const outGate = new Duplicator(outGate1, outGate2);

      const agent = new Agent(inGate, outGate);
      agent.main = async (item) => {
        item.val *= 3;
        return item;
      };

      await agent.run();
      assert.deepEqual(outGate1.data, [{ val: 3 }, { val: 6 }]);
      assert.deepEqual(outGate2.data, [{ val: 3 }, { val: 6 }]);
    })
  })
})

describe('duplicator', () => {
  it('copy-distributes an item to gates for Output', async () => {
    const inGate = new MemoryGate([{ val: 1 }, { val: 2 }]);
    const outGate1 = new MemoryGate();

    const agent = new Agent(inGate, duplicator(outGate1));
    agent.main = async (item) => {
      item.val *= 3;
      return item;
    };

    await agent.run();
    assert.deepEqual(outGate1.data, [{ val: 3 }, { val: 6 }]);
  })
})
