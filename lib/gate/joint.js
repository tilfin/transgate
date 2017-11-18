const ItemBuffer = require('./buffer');

/**
 * Joint between two agents
 */
class JointGate {
  constructor() {
    this._buffer = new ItemBuffer();
  }

  /**
   * @return {Promise<object>} - a promise that resolves the item when buffer contains or sended
   */
  async receive() {
    return await this._buffer.read();
  }

  /**
   * @param  {object} item - sending item
   * @return {Promise} - a promise that resolves immediately
   */
  async send(item) {
    await this._buffer.write(item);
  }
}

module.exports = JointGate;
