/**
 * Copying and item and sending all gates for Output
 */
export class Duplicator {

  private _outGates: any[]
  /**
   * @param  {...Gate} outGates - destination gates
   */
  constructor(...outGates) {
    this._outGates = outGates;
  }

  /**
   * @param  {object} item - sending item
   * @return {Promise} - a promise that resolves when the item has been sended
   */
  async send(item) {
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
export function duplicator(...outGates) {
  return new Duplicator(...outGates);
}
