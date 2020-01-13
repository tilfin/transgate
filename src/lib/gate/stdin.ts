import { ReadLineStreamGate } from './readline_stream'
import { GateItem } from './type'

/**
 * Stdin Gate for Input
 */
export class StdinGate<T extends GateItem> extends ReadLineStreamGate<T> {
  constructor() {
    process.stdin.setEncoding('utf8');
    super(process.stdin);
  }

  /**
   * @return {Promise<object>} - A promise that resolves the item when recevied
   */
  receive(): Promise<T | null> {
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
