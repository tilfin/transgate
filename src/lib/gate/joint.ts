import { ItemBuffer } from './buffer'
import { GateItem } from './type';

/**
 * Joint between two agents
 */
export class JointGate<T extends GateItem> {

  private _buffer: ItemBuffer<T>

  constructor() {
    this._buffer = new ItemBuffer();
  }

  /**
   * @return {Promise<object>} - a promise that resolves the item when buffer contains or sended
   */
  receive(): Promise<T | null> {
    return this._buffer.read();
  }

  /**
   * @param  {object} item - sending item
   * @return {Promise} - a promise that resolves immediately
   */
  async send(item: T | null) {
    await this._buffer.write(item);
  }
}
