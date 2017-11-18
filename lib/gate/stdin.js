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

  _parse(data) {
    return JSON.parse(data);
  }
}

module.exports = StdinGate
