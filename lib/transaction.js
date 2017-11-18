/**
 * Process an item read from Input Gate and write into Output Gate
 */
class Transaction {

  /**
   * @param {Gate} input - Input gate
   * @param {Gate|Array<Gate>} outputs - Output gate or its array
   */
  constructor(input, ...outputs) {
    this._input = input;
    this._outputs = outputs;
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

  async run(input, outputs) {
    await this.before();

    let item;
    while ((item = await this._input.read()) !== null) {
      const result = await this.main(item, ...this._outputs);
      if (result !== undefined) {
        this._outputs[0].write(result);
      }
    }

    await Promise.all(this._outputs.map(op => op.write(null)));

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
 * Shortcut to create Transaction
 * @param  {Gate} input   - Input gate
 * @param  {Gate} output  - Output gate
 * @param  {Promise} main - Process main Promise function
 * @return {Transaction} created one
 */
Transaction.create = function(input, output, main) {
  const action = new Transaction(input, output);
  action.main = main;
  return action;
}

/**
 * Start all transactions
 * @param  {Transaction} ...actions - Transaction(s)
 * @return {Promise} A Promise that resolves when all transactions have done
 */
Transaction.start = async function(...actions) {
  return await Promise.all(actions.map(t => t.run()));
}

module.exports = Transaction;
