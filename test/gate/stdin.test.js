const assert = require('assert');
const stdin = require('mock-stdin').stdin();

const StdinGate = require('../../lib/gate/stdin');

describe('StdinGate', () => {

  describe('#receive', () => {

    it('returns stdin data', async () => {
      const gate = new StdinGate();
      Promise.all[(async () => {
          assert.deepEqual(await gate.receive(), { a: 1 });
          assert.deepEqual(await gate.receive(), { b: 'str' });
          assert.equal(await gate.receive(), null);
        }),
        (async () => {
          stdin.send('{"a":1}');
          stdin.send('{ "b" : "str" }');
          stdin.send(null);
        })
      ]
    })
  })

})
