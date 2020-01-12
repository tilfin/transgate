const ItemBuffer = require('../gate/buffer');

/**
 * Merging items from gates for Input
 */
class Mixer {
  /**
   * @param  {...Gate} outGates - source gates
   */
  constructor(...inGates) {
    this._buffer = new ItemBuffer();
    this._runnerAliveSet = new Set();
    this._runners = inGates.map((g, idx) => this._createRunner(g, idx));
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

  async _createRunner(gate, idx) {
    this._runnerAliveSet.add(idx);

    let item;
    while ((item = await gate.receive()) !== null) {
      await this._buffer.write(item);
    }

    await this._destroyRunner(idx);
  }

  async _destroyRunner(idx) {
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
function mixer(...inGates) {
  const m = new Mixer(...inGates);
  m.run();
  return m;
}


module.exports =  {
  Mixer,
  mixer,
};
