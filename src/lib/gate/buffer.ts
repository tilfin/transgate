import { GateItem } from "./type"

/**
 * Item buffer for Long polling or Joint
 */
export class ItemBuffer<T extends GateItem> {

  private _list: Array<T | null>
  private _on: Function | null

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
  read(): Promise<T | null> {
    if (this._list.length) {
      return Promise.resolve(this._list.shift() || null);
    }

    return new Promise(resolve => {
      this._on = (item: T | null) => {
        this._on = null;
        resolve(item);
      }
    });
  }

  /**
   * @param  {object} item - written item
   * @return {Promise} - a promise that resolves when the item has been written
   */
  write(item: T | null) {
    this._list.push(item);
    if (this._on) {
      this._on(this._list.shift());
    }
    return Promise.resolve();
  }
}
