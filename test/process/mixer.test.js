const assert = require('assert');

const { Agent, Mixer, mixer, MemoryGate } = require('../../');

describe('Mixer', () => {
  describe('#new and #run', () => {
    it('creates a Mixer and merges items from gates for Input', async () => {
      const oddInGate = new MemoryGate([{ val: 1 }, { val: 3 }]);
      const evenInGate = new MemoryGate([{ val: 2 }, { val: 4 }]);
      const outgate = new MemoryGate();

      const inGate = new Mixer(oddInGate, evenInGate);
      inGate.run();

      const agent = new Agent(inGate, outgate);
      agent.main = async (item) => {
        item.val *= 3;
        return item;
      };

      await agent.run();
      assert.deepEqual(outgate.data, [
        { val: 3 }, { val: 6 }, { val: 9 }, { val: 12 }
      ]);
    })
  })
})

describe('mixer', () => {
  it('merges items from gates for Input', async () => {
    const evenInGate = new MemoryGate([{ val: 2 }, { val: 4 }, { val: 6 }]);
    const oddInGate = new MemoryGate([{ val: 1 }]);
    const outgate = new MemoryGate();

    const agent = new Agent(mixer(evenInGate, oddInGate), outgate);
    agent.main = async (item) => {
      item.val *= 3;
      return item;
    };

    await agent.run();
    assert.deepEqual(outgate.data, [{ val: 6 }, { val: 3 }, { val: 12 }, { val: 18 }]);
  })
})
