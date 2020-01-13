import { ItemBuffer } from '../gate/buffer'
import { GateItem, InGate } from '../gate/type'

/**
 * Merging items from gates for Input
 */
export class Mixer<T extends GateItem> {
  private _buffer: ItemBuffer<T>;
  private _runnerAliveSet: Set<number>
  private _runners: Promise<void>[]

  /**
   * @param  {...Gate} outGates - source gates
   */
  constructor(...inGates: InGate<T>[]) {
    this._buffer = new ItemBuffer<T>();
    this._runnerAliveSet = new Set();
    this._runners = inGates.map((g: InGate<T>, idx) => this._createRunner(g, idx));
  }

  /**
   * execute.
   */
  async run() {
    return await Promise.all(this._runners);
  }

  /**
   * @return {Promise<object>} - A promise that resolves the item when recevied
   */
  async receive() {
    return await this._buffer.read();
  }

  async _createRunner(gate: InGate<T>, idx: number) {
    this._runnerAliveSet.add(idx);

    let item;
    while ((item = await gate.receive()) !== null) {
      await this._buffer.write(item);
    }

    await this._destroyRunner(idx);
  }

  async _destroyRunner(idx: number) {
    this._runnerAliveSet.delete(idx);
    if (this._runnerAliveSet.size === 0) {
      await this._buffer.write(null);  
    }    
  }
}

/**
 * Merging items from gates for Input
 * @param  {...Gate} outGates - source gates
 * @return {Mixer}
 */
export function mixer<T extends GateItem>(...inGates: InGate<T>[]) {
  const m = new Mixer<T>(...inGates);
  m.run();
  return m;
}
