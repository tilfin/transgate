/**
 * Stdout Gate for Output
 */
class StdoutGate {
  /**
   * @param  {object} item - sending item
   * @return {Promise} - a promise that resolves when the item has been sended
   */
  send(item) {
    return this.write(item);
  }

  /**
   * @return {Promise<object>} - A promise that resolves the item when recevied
   */
  receive() {
    throw new Error('Receive not supported');
  }

  /**
   * @param  {object} item - written item
   * @return {Promise} - a promise that resolves when the item has been dumped as JSON
   */
  async write(item) {
    if (item === null) return;
    process.stdout.write(this._stringify(item));
  }

  /**
   * Convert item to string
   * @param  {object} item - sended item
   * @return {string} written to stdout
   */
  _stringify(item) {
    return JSON.stringify(item) + '\n';
  }
}

module.exports = StdoutGate;
