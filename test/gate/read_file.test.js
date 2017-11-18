const fs = require('fs');
const assert = require('assert');

const ReadFileGate = require('../../lib/gate/read_file');

describe('ReadFileGate', () => {
  const fixturePath = './test/fixtures/data.json';

  describe('#receive', () => {
    it('returns data from file', async () => {
      const gate = new ReadFileGate(fixturePath);
      assert.deepEqual(await gate.receive(), { a: 1 });
      assert.deepEqual(await gate.receive(), { b: 'str' });
      assert.equal(await gate.receive(), null);
    })
  })

})
