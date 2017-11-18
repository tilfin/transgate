const ItemBuffer = require('./buffer');

module.exports =
class JointGate {
  constructor() {
    this._buffer = new ItemBuffer();
  }

  async receive() {
    return await this._buffer.read();
  }

  async send(item) {
    await this._buffer.write(item);
  }
}
