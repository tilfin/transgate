const assert = require('assert');

const Agent = require('../../lib/process/agent');
const { JointGate, MemoryGate } = require('../../lib/gate');

describe('Agent', () => {

  describe('#run', () => {
    context('only one outgate', () => {
      it('works main that returns the result', async () => {
        const ingate = new MemoryGate([{ val: 1 }, { val: 2 }]);
        const outgate = new MemoryGate();

        const agent = new Agent(ingate, outgate);
        agent.main = async (item) => {
          item.val *= 3;
          item.done = true;
          return item;
        };

        await agent.run();
        assert.deepEqual(outgate.data, [
          { val: 3, done: true },
          { val: 6, done: true }
        ]);
      })

      it('works main that writes the result to outgate', async () => {
        const ingate = new MemoryGate([{ val: 1 }, { val: 2 }]);
        const outgate = new MemoryGate();

        const agent = new Agent(ingate, outgate);
        agent.main = async (item, outgate) => {
          item.val *= 5;
          item.done = true;
          outgate.send(item);
        };

        await agent.run();
        assert.deepEqual(outgate.data, [
          { val: 5, done: true },
          { val: 10, done: true }
        ]);
      })
    })

    context('plural outgates', () => {
      it('works main that returns the result', async () => {
        const ingate = new MemoryGate([
          { city: 'Tokyo', country: 'Japan' },
          { city: 'Paris', country: 'France' },
          { city: 'Osaka', country: 'Japan' },
          { city: 'London', country: 'United Kingdom' },
        ]);
        const japanGate = new MemoryGate();
        const franceGate = new MemoryGate();

        const agent = new Agent(ingate, { japanGate, franceGate });
        agent.main = async (item, { japanGate, franceGate }) => {
          if (item.country === 'Japan') {
            japanGate.send(item);
          } else if (item.country === 'France') {
            franceGate.send(item);
          }
        };

        await agent.run();

        assert.deepEqual(japanGate.data, [
          { city: 'Tokyo', country: 'Japan' },
          { city: 'Osaka', country: 'Japan' },
        ]);
        assert.deepEqual(franceGate.data, [
          { city: 'Paris', country: 'France' },
        ]);
      })
    })

    context('when raise an error', () => {
      it('after hook works and catches the error', async () => {
        const ingate = new MemoryGate([{ value: 1 }]);
        const outgate = new MemoryGate();

        const confirmProcessOrder = [];

        class RaiseErrorAgent extends Agent {
          async before() {
            confirmProcessOrder.push('1 Do before');
          }

          async after() {
            confirmProcessOrder.push('3 Do after');
          }

          async main() {
            confirmProcessOrder.push('2 Raise error');
            throw new Error('dummy error');
          }
        }

        const agent = new RaiseErrorAgent(ingate, outgate);

        try {
          await agent.run();
        } catch(e) {
          confirmProcessOrder.push('4 Catched error');
          assert.equal(e.message, 'dummy error');
        }

        assert.equal(outgate.data.length, 0); // not sended
        assert.deepEqual(confirmProcessOrder, [
          '1 Do before',
          '2 Raise error',
          '3 Do after',
          '4 Catched error'
        ]);
      })
    })
  })

  describe('#create', () => {
    it('returns a agent instance and it works rightly', async () => {
      const ingate = new MemoryGate([{ val: 1 }, { val: 2 }]);
      const outgate = new MemoryGate();

      const agent = Agent.create(ingate, outgate, async (item) => {
        item.val -= 1;
        item.done = true;
        return item;
      });

      await agent.run();
      assert.deepEqual(outgate.data, [
        { val: 0, done: true },
        { val: 1, done: true }
      ]);
    })
  })

  describe('#start', () => {
    class Value3times extends Agent {
      async main(item) {
        item.val *= 3;
        return item;
      }
    }

    class SetDoneFalse extends Agent {
      async main(item) {
        item.done = false;
        return item;
      }
    }

    it('proceeds agents', async () => {
      const ingate = new MemoryGate([{ val: 1 }, { val: 2 }]);
      const outgate = new MemoryGate();
      const joint = new JointGate();

      await Agent.all(
        new Value3times(ingate, joint),
        new SetDoneFalse(joint, outgate),
      )
      assert.deepEqual(outgate.data, [
        { val: 3, done: false },
        { val: 6, done: false }
      ]);
    })

    it('proceeds agents without the order of start args', async () => {
      const ingate = new MemoryGate([{ val: 1 }, { val: 2 }]);
      const outgate = new MemoryGate();
      const joint = new JointGate();

      await Agent.all(
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
