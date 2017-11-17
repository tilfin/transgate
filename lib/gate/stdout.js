/**
 * Stdout Gate for Output
 */
class StdoutGate {
  constructor() {
    process.stdout.setEncoding('utf8');
  }

  /**
   * @param  {object} item - written item
   * @return {Promise} - a promise that resolves when the item has been dumped as JSON
   */
  async write(item) {
    if (item === null) return;
    process.stdout.write(this._stringify(item));
  }

  _stringify(item) {
    return JSON.stringify(item) + '\n';
  }
}

module.exports = StdoutGate;
