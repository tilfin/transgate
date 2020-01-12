const ReadlineStreamGate = require('./readline_stream');

/**
 * Stdin Gate for Input
 */
class StdinGate extends ReadlineStreamGate {
  constructor() {
    process.stdin.setEncoding('utf8');
    super(process.stdin);
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

module.exports = StdinGate
