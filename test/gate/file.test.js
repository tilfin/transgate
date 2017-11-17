const fs = require('fs');
const assert = require('assert');

describe('FileGate', () => {
  const FileGate = require('../../lib/gate/file');
  const fixturePath = './test/fixtures/data.json';

  describe('#read()', () => {
    it('reads data from file', async () => {
      const t = new FileGate(fixturePath);
      assert.deepEqual(await t.read(), { a: 1 });
      assert.deepEqual(await t.read(), { a: 2 });
      assert.equal(await t.read(), null);
    });
  });

  describe('#write()', () => {
    it('appends data to file', async () => {
      const writtenPath = '/tmp/dummy' + (new Date().getTime()) + '.json';

      const t = new FileGate(writtenPath);
      await t.write({ a: 1 });
      await t.write({ a: 2 });

      const wdata = fs.readFileSync(writtenPath, { encoding: 'utf8' });
      const tdata = fs.readFileSync(fixturePath, { encoding: 'utf8' });
      assert.deepEqual(wdata, tdata);

      fs.unlinkSync(writtenPath);
    });
  });
});
