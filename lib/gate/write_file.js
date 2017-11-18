const fs = require('fs');
const util = require('util');
const appendFile = util.promisify(fs.appendFile);

/**
 * Write file Gate for Input/Output
 */
class WriteFileGate {

  /**
   * @param {string} path - file path
   */
  constructor(path) {
    this._path = path;
  }

  /**
   * @param  {object} item - written item
   * @return {Promise} - a promise that resolves when the item has been written
   */
  async send(item) {
    if (item === null) {
      return await this.close();
    }
    await appendFile(this._path, this._stringify(item) + '\n', 'utf8');
  }

  _stringify(data) {
    return JSON.stringify(data)
  }
}

module.exports = WriteFileGate;
