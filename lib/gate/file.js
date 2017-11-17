const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);
const appendFile = util.promisify(fs.appendFile);

class FileGate {
  constructor(path) {
    this._path = path;
    this._items = null;
  }

  async read() {
    if (this._items === null) {
      this._items = await this._loadItemsFromFile();
    }

    if (this._items.length) {
      return this._items.shift();
    } else {
      return null;
    }
  }

  async write(item) {
    if (item === null) {
      return await this.close();
    }
    await appendFile(this._path, this._stringify(item) + '\n', 'utf8');
  }

  async close() {    
  }

  async _loadItemsFromFile() {
    const data = await readFile(this._path, { encoding: 'utf8' });
    const items = [];
    for (const str of data.split('\n')) {
      if (str) items.push(this._parse(str));
    }
    return items;
  }

  async _writer() {
    if (this._writer === null) {
      this._writer = await fopen(this._path, 'w');
    }
    return this._writer;
  }

  _parse(str) {
    return JSON.parse(str)
  }

  _stringify(data) {
    return JSON.stringify(data)
  }
}

module.exports = FileGate;
