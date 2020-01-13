const assert = require('assert')
const stdMocks = require('std-mocks')

const { StdoutGate } = require('../../dist/lib/gate/stdout')

describe('StdoutGate', () => {

  describe('#send', () => {

    it('outputs sended data', async () => {
      stdMocks.use();
      const outgate = new StdoutGate();
      await outgate.send({ a: 1 });
      await outgate.send({ b: 'str' });
      await outgate.send(null);
      stdMocks.restore();

      const output = stdMocks.flush();
      assert.deepEqual(output.stdout, [
        '{"a":1}\n',
        '{"b":"str"}\n'
      ]);
    })
  })

})
