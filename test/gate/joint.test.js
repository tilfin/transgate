const assert = require('assert')
const { JointGate } = require('../../dist/lib/gate/joint')

describe('JointGate', () => {

  describe('#send and #receive', () => {
    const item1 = { a: 1 };
    const item2 = { b: 2 };

    it('passes sorted data', async () => {
      const gate = new JointGate();
      await gate.send(item1);
      await gate.send(item2);
      assert.deepEqual(await gate.receive(), item1);
      assert.deepEqual(await gate.receive(), item2);
    })
  })

  describe('#receive before #send', () => {
    const item = { rw: 1 };

    it('sends an written item via polling', (done) => {
      const gate = new JointGate();

      gate.receive()
      .then(result => {
        assert.deepEqual(result, item);
        done();
      })
      .catch(done);

      gate.send(item);
    })
  })

})
