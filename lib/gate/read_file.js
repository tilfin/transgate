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

  /**
   * Convert string to item
   * @param  {string} data - a line from stdin
   * @return {object} item returned to the receiver
   */
  _parse(data) {
    return JSON.parse(data);
  }
}

module.exports = ReadFileGate;
