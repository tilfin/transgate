import fs from 'fs'
import util from 'util'
import { OutGate, GateItem } from './type'

const appendFile = util.promisify(fs.appendFile);

/**
 * Write file Gate for Input/Output
 */
export class WriteFileGate<T extends GateItem> implements OutGate<T> {

  /**
   * @param {string} path - file path
   */
  constructor(private path: string) {
  }

  /**
   * @param  {object} item - written item
   * @return {Promise} - a promise that resolves when the item has been written
   */
  async send(item: T | null) {
    if (item === null) {
      return;
    }
    await appendFile(this.path, this._stringify(item) + '\n', 'utf8');
  }

  /**
   * Convert item to string
   * @param  {object} item - sended item
   * @return {string} written to stdout
   */
  _stringify(data: T) {
    return JSON.stringify(data)
  }
}
