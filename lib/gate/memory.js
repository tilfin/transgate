/**
 * Memory Gate for Input/Output
 */
class MemoryGate {
  constructor(initialData) {
    this._list = initialData || [];
  }

  /**
   * @return {Promise<object>} - A promise that resolves the item when recevied
   */
  async receive() {
    const d = this._list.shift();
    return d !== undefined ? d : null;
  }

  /**
   * @param  {object} item - sending item
   * @return {Promise} - a promise that resolves when the item has been sended
   */
  async send(item) {
    if (item === null) return;
    this._list.push(item);
  }
  /**
   * @return {Array} written item list
   */
  get data() {
    return this._list;
  }
}

module.exports = MemoryGate;
