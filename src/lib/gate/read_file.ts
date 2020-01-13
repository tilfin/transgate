import fs from 'fs'
import { ReadLineStreamGate } from './readline_stream'

/**
 * Read file Gate for Input
 */
export class ReadFileGate<T> extends ReadLineStreamGate<T> {
  constructor(path: string) {
    super(fs.createReadStream(path));
  }

  /**
   * @return {Promise<object>} - A promise that resolves the item when recevied
   */
  async receive(): Promise<T | null> {
    return super.receive();
  }

  /**
   * Convert string to item
   * @param  {string} data - a line from stdin
   * @return {object} item returned to the receiver
   */
  _parse(data: string): T {
    return JSON.parse(data);
  }
}
