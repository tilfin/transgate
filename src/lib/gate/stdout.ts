import { OutGate, GateItem } from './type'

/**
 * Stdout Gate for Output
 */
export class StdoutGate<T extends GateItem> implements OutGate<T> {
  /**
   * @param  {object} item - sending item
   * @return {Promise} - a promise that resolves when the item has been sended
   */
  send(item: T): Promise<void> {
    if (item !== null) {
      process.stdout.write(this._stringify(item));
    }
    return Promise.resolve();
  }

  /**
   * Convert item to string
   * @param  {object} item - sended item
   * @return {string} written to stdout
   */
  _stringify(item: T): string {
    return JSON.stringify(item) + '\n';
  }
}
