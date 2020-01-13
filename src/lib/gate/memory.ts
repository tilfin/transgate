import { GateItem, OutGate, InGate } from './type'

/**
 * Memory Gate for Input/Output
 */
export class MemoryGate<T extends GateItem> implements OutGate<T>, InGate<T> {

  private _list: Array<T | null>

  constructor(initialData: Array<T>) {
    this._list = initialData || [];
  }

  /**
   * @return {Promise<object>} - A promise that resolves the item when recevied
   */
  async receive(): Promise<T | null> {
    const d = this._list.shift();
    return d !== undefined ? d : null;
  }

  /**
   * @param  {object} item - sending item
   * @return {Promise} - a promise that resolves when the item has been sended
   */
  async send(item: T | null) {
    if (item === null) return;
    this._list.push(item);
  }

  /**
   * @return {Array} written item list
   */
  get data(): Array<T | null> {
    return this._list;
  }
}
