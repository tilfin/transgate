/**
 * Process an item read from Input Gate and write into Output Gate
 */
class Agent {

  /**
   * @param {Gate} ingate - Input gate
   * @param {Gate|Object<string, Gate>} outgate - Output gate or its map
   */
  constructor(ingate, outgate) {
    this._ingate = ingate;
    this._outgate = outgate;
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

    let error = null;
    try {
      let item;
      while ((item = await this._ingate.receive()) !== null) {
        const result = await this.main(item, this._outgate);
        if (result !== undefined) {
          this._outgate.send(result);
        }
      }

      //console.info('send null')
      if (typeof this._outgate.send === 'function') {
        await this._outgate.send(null);
      } else {
        await Promise.all(Object.values(this._outgate).map(og => og.send(null)));
      }
    } catch(err) {
      error = err;
    }

    await this.after();

    if (error) throw error;
  }

  /**
   * Process main Promise function
   * @param {object} item - read item
   * @param {Array<OutputGate>} outgates - Output gates
   * @return {object|array} written item(s). it is an array if output is plural. `undefined` iss not written.
   */
  async main(item, outgates) {
  }

}

/**
 * Shorthand to create Agent
 * @param  {Gate} ingate   - Input gate
 * @param {Gate|Object<string, Gate>} outgate - Output gate or its map
 * @param  {Promise} main - Process main Promise function
 * @return {Agent} created one
 */
Agent.create = function(ingate, outgate, main) {
  const action = new Agent(ingate, outgate);
  action.main = main;
  return action;
}

/**
 * Start all agents
 * @param  {Agent} ...agents - Agent(s)
 * @return {Promise} A Promise that resolves when all agents have done
 */
Agent.all = async function(...agents) {
  return await Promise.all(agents.map(t => t.run()));
}

module.exports = Agent;
