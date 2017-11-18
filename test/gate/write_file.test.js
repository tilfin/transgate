const fs = require('fs');
const assert = require('assert');

const WriteFileGate = require('../../lib/gate/write_file');

describe('WriteFileGate', () => {

  describe('#send', () => {
    it('appends data to file', async () => {
      const fixturePath = './test/fixtures/data.json';
      const writtenPath = '/tmp/dummy' + (new Date().getTime()) + '.json';

      const t = new WriteFileGate(writtenPath);
      await t.send({ a: 1 });
      await t.send({ b: 'str' });

      const wdata = fs.readFileSync(writtenPath, { encoding: 'utf8' });
      const tdata = fs.readFileSync(fixturePath, { encoding: 'utf8' });
      assert.deepEqual(wdata, tdata);

      fs.unlinkSync(writtenPath);
    })
  })

})
