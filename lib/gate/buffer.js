/**
 * Item buffer Gate for Long polling or Joint
 */
class BufferGate {
  constructor() {
    this._list = [];
    this._on = null;
  }

  /**
   * @return {Array} buffered item list
   */
  get data() {
    return this._list;
  }

  /**
   * @return {Promise} - A promise that resolves an item when the item is written
   */
  read() {
    if (this._list.length) {
      return Promise.resolve(this._list.shift());
    }

    return new Promise(resolve => {
      this._on = item => {
        this._on = null;
        resolve(item);
      }
    });
  }

  /**
   * @param  {object} item - written item
   * @return {Promise} - a promise that resolves when the item has been written
   */
  write(item) {
    this._list.push(item);
    if (this._on) {
      this._on(this._list.shift());
    }
    return Promise.resolve();
  }
}

module.exports = BufferGate;
