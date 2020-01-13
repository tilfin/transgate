import readline from 'readline'
import { Readable } from 'stream'
import { ItemBuffer } from './buffer'
import { InGate } from './type'

/**
 * Readline stream Gate for Input
 */
export abstract class ReadLineStreamGate<T> implements InGate<T> {

  private _buffer: ItemBuffer<T>

  /**
   * @param  {stream.Readable} readStream - readable stream
   */
  constructor(readStream: Readable) {
    this._buffer = new ItemBuffer<T>();

    readline.createInterface({
      input: readStream,
      crlfDelay: Infinity,
    })
    .on('line', line => {
      this._buffer.write(this._parse(line));
    })
    .on('close', () => {
      this._buffer.write(null);
    });
  }

  /**
   * @return {Promise<object>} - A promise that resolves the item when a line can be read
   */
  receive(): Promise<T | null>  {
    return this._buffer.read();
  }

  /**
   * Convert string to item.
   * Sub-class should override
   * @param  {string} data - a line from stdin
   * @return {object} item returned to the receiver
   */
  abstract _parse(data: string): T
}
