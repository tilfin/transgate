/**
 * Process an item read from Input Gate and write into Output Gate
 */
class Transaction {

  /**
   * @param {Gate} input - Input Gate
   * @param {Gate} ...outputs - Output Gate or its array
   */
  constructor(input, ...outputs) {
    this._input = input;
    this._outputs = outputs;
  }

  async run(input, outputs) {
    let item;
    while ((item = await this._input.read()) !== null) {
      const result = await this.main(item);
      const promises = [];
      [].concat(result).map((r, i) => {
        if (r !== undefined) {
          this._outputs[i].write(r);
        }        
      });
      await Promise.all(promises);
    }

    await Promise.all(this._outputs.map(op => op.write(null)));
  }

  /**
   * Process main Promise function
   * @param  {object} item - read item
   * @return {object|array} written item(s). it is an array if output is plural. `undefined` iss not written.
   */
  async main(item) {
    return item;
  }

}

/**
 * Shortcut to create Transaction
 * @param  {Gate} input   - Input Gate
 * @param  {Gate} output  - Output Gate
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
