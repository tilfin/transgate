/**
 * Memory Gate for Input/Output
 */
class MemoryGate {
  constructor(initialData) {
    this._list = initialData || [];
  }

  /**
   * @return {Array} written item list
   */
  get data() {
    return this._list;
  }

  /**
   * @return {Promise} - A promise that resolves an item
   */
  read() {
    const d = this._list.shift();
    return Promise.resolve(d !== undefined ? d : null);
  }

  /**
   * @param  {object} item - written item
   * @return {Promise} - a promise that resolves when the item has been written
   */
  write(item) {
    if (item === null) {
      return Promise.resolve();
    }
    this._list.push(item);
    return Promise.resolve();
  }
}

module.exports = MemoryGate;
