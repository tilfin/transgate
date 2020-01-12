const readline = require('readline');

const ItemBuffer = require('./buffer');

/**
 * Readline stream Gate for Input
 */
class ReadLineStreamGate {

  /**
   * @param  {stream.Readable} readStream - readable stream
   */
  constructor(readStream) {
    this._buffer = new ItemBuffer();

    const rl = readline.createInterface({
      input: readStream,
      crlfDelay: Infinity,
    })
    .on('line', line => {
      this._buffer.write(this._parse(line));
    })
    .on('close', () => {
      this._buffer.write(null);
    });
  }

  /**
   * @return {Promise<object>} - A promise that resolves the item when a line can be read
   */
  receive() {
    return this._buffer.read();
  }

  /**
   * Convert string to item.
   * Sub-class should override
   * @param  {string} data - a line from stdin
   * @return {object} item returned to the receiver
   */
  _parse(data) {
    return data;
  }

}

module.exports = ReadLineStreamGate;
