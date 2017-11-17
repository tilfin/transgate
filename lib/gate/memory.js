class MemoryGate {
  constructor(initialData) {
    this._list = initialData || [];
  }

  get data() {
    return this._list;
  }

  read() {
    const d = this._list.shift();
    return Promise.resolve(d !== undefined ? d : null);
  }

  write(item) {
    if (item === null) {
      return this.close();
    }
    this._list.push(item);
    return Promise.resolve();
  }
}

module.exports = MemoryGate;
