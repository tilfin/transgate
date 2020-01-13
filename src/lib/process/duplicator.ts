import { GateItem, OutGate } from '../gate'

/**
 * Copying and item and sending all gates for Output
 */
export class Duplicator<T extends GateItem> {

  private _outGates: OutGate<T>[]

  /**
   * @param  {...Gate} outGates - destination gates
   */
  constructor(...outGates: OutGate<T>[]) {
    this._outGates = outGates;
  }

  /**
   * @param  {object} item - sending item
   * @return {Promise} - a promise that resolves when the item has been sended
   */
  async send(item: T | null) {
    await Promise.all(this._outGates.map(gate => {
      return gate.send(item !== null ? Object.assign({}, item) : null);
    }));
  }
}

/**
 * Copying and item and sending all gates for Output
 * @param  {...Gate} outGates - destination gates
 * @return {Duplicator}
 */
export function duplicator<T extends GateItem>(...outGates: OutGate<T>[]) {
  return new Duplicator<T>(...outGates);
}
