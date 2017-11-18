const readline = require('readline');

const ItemBuffer = require('./buffer');

class ReadLineStreamGate {

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

  receive() {
    return this._buffer.read();
  }

  _parse(data) {
    return data;
  }

}

module.exports = ReadLineStreamGate;
