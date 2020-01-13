const assert = require('assert')
const { IntervalGate } = require('../../dist/lib/gate/interval')

describe('IntervalGate', () => {

  describe('#receive', () => {
    context('in normal', () => {
      const gate = new IntervalGate(0.3);

      it('returns the time every interval passing', async () => {
        const item1 = await gate.receive();
        const item2 = await gate.receive();
        const item3 = await gate.receive();

        const d1 = item2.time.getTime() - item1.time.getTime();
        const d2 = item3.time.getTime() - item2.time.getTime();
        assert.ok(d1 > 290 && d1 < 320);
        assert.ok(d2 > 290 && d2 < 320);

        const promise4 = gate.receive();
        gate.clear();
        assert.equal(await promise4, null);
      })

      it('works rightly after restart', async () => {
        const item1 = await gate.receive();
        const item2 = await gate.receive();

        const d1 = item2.time.getTime() - item1.time.getTime();
        assert.ok(d1 > 290 && d1 < 320);

        const promise4 = gate.receive();
        gate.clear();
        assert.equal(await promise4, null);
      })
    })

    context('double call', () => {
      it('throws an error', async () => {
        const gate = new IntervalGate(0.2);
        const item1 = await gate.receive();
        assert.ok(item1.time instanceof Date);
        const promise2 = gate.receive();

        try {
          await gate.receive();
          assert.fail('An error should be occurrered')
        } catch(e) {
          assert.equal(e.message, 'Do not double receive');
        }

        const item2 = await promise2;
        assert.ok(item2.time instanceof Date);

        const promise4 = gate.receive();
        gate.clear();
        assert.equal(await promise4, null);
      })
    })
  })

})
