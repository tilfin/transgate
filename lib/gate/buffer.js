class BufferGate {
  constructor() {
    this._list = [];
    this._on = null;
  }

  get data() {
    return this._list;
  }

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

  write(item) {
    this._list.push(item);
    if (this._on) {
      this._on(this._list.shift());
    }
    return Promise.resolve();
  }
}

module.exports = BufferGate;
