class StdoutGate {
  constructor() {
    process.stdout.setEncoding('utf8');
  }

  async write(item) {
    if (item === null) return;
    process.stdout.write(this._stringify(item));
  }

  _stringify(item) {
    return JSON.stringify(item) + '\n';
  }
}

module.exports = StdoutGate;
