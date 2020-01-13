const fs = require('fs')
const assert = require('assert')

const { WriteFileGate } = require('../../dist/lib/gate/write_file')

describe('WriteFileGate', () => {

  describe('#send', () => {
    it('appends data to file', async () => {
      const fixturePath = './test/fixtures/data.json';
      const writtenPath = '/tmp/dummy' + (new Date().getTime()) + '.json';

      const gate = new WriteFileGate(writtenPath);
      await gate.send({ a: 1 });
      await gate.send({ b: 'str' });

      const wdata = fs.readFileSync(writtenPath, { encoding: 'utf8' });
      const tdata = fs.readFileSync(fixturePath, { encoding: 'utf8' });
      assert.equal(wdata, tdata);

      fs.unlinkSync(writtenPath);
    })
  })

})
