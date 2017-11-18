const fs = require('fs');

const ReadlineStreamGate = require('./readline_stream');

/**
 * Read file Gate for Input
 */
class ReadFileGate extends ReadlineStreamGate {
  constructor(path) {
    super(fs.createReadStream(path));
  }

  /**
   * @return {Promise<object>} - A promise that resolves the item when recevied
   */
  receive() {
    return super.receive();
  }

  _parse(data) {
    return JSON.parse(data);
  }
}

module.exports = ReadFileGate;
