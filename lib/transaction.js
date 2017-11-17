class Transaction {

  constructor(input, ...outputs) {
    this._input = input;
    this._outputs = outputs;
  }

  async run(input, outputs) {
    let item;
    while ((item = await this._input.read()) !== null) {
      const result = await this.main(item);
      const writings = [].concat(result).map((r, i) => this._outputs[i].write(r));
      await Promise.all(writings);
    }

    await Promise.all(this._outputs.map(op => op.write(null)));
  }

  async main(item) {
    return item;
  }

}

Transaction.create = function(input, output, main) {
  const action = new Transaction(input, output);
  action.main = main;
  return action;
}

Transaction.start = async function(...actions) {
  return await Promise.all(actions.map(t => t.run()));
}

module.exports = Transaction;
