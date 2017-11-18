/**
 * Process an item read from Input Gate and write into Output Gate
 */
class Agent {

  /**
   * @param {Gate} ingate - Input gate
   * @param {Gate|Array<Gate>} outgates - Output gate or its array
   */
  constructor(ingate, ...outgates) {
    this._ingate = ingate;
    this._outgates = outgates;
  }

  /**
   * Processes should be defined before all transactions
   */
  async before() {
  }

  /**
   * Processes should be defined after all transactions
   */
  async after() {
  }

  async run() {
    await this.before();

    let item;
    while ((item = await this._ingate.receive()) !== null) {
      const result = await this.main(item, ...this._outgates);
      if (result !== undefined) {
        this._outgates[0].send(result);
      }
    }

    await Promise.all(this._outgates.map(op => op.send(null)));

    await this.after();
  }

  /**
   * Process main Promise function
   * @param {object} item - read item
   * @param {Array<OutputGate>} outputs - Output gates
   * @return {object|array} written item(s). it is an array if output is plural. `undefined` iss not written.
   */
  async main(item, ...outputs) {
  }

}

/**
 * Shortcut to create Agent
 * @param  {Gate} input   - Input gate
 * @param  {Gate} output  - Output gate
 * @param  {Promise} main - Process main Promise function
 * @return {Agent} created one
 */
Agent.create = function(input, output, main) {
  const action = new Agent(input, output);
  action.main = main;
  return action;
}

/**
 * Start all transactions
 * @param  {Agent} ...actions - Agent(s)
 * @return {Promise} A Promise that resolves when all transactions have done
 */
Agent.start = async function(...actions) {
  return await Promise.all(actions.map(t => t.run()));
}

module.exports = Agent;
