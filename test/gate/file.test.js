const fs = require('fs');
const assert = require('assert');

const FileGate = require('../../lib/gate/file');

describe('FileGate', () => {
  const fixturePath = './test/fixtures/data.json';

  describe('#receive', () => {
    it('returns data from file', async () => {
      const t = new FileGate(fixturePath);
      assert.deepEqual(await t.receive(), { a: 1 });
      assert.deepEqual(await t.receive(), { a: 2 });
      assert.equal(await t.receive(), null);
    })
  })

  describe('#send', () => {
    it('appends data to file', async () => {
      const writtenPath = '/tmp/dummy' + (new Date().getTime()) + '.json';

      const t = new FileGate(writtenPath);
      await t.send({ a: 1 });
      await t.send({ a: 2 });

      const wdata = fs.readFileSync(writtenPath, { encoding: 'utf8' });
      const tdata = fs.readFileSync(fixturePath, { encoding: 'utf8' });
      assert.deepEqual(wdata, tdata);

      fs.unlinkSync(writtenPath);
    })
  })

})
