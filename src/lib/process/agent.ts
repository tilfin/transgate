import { GateItem, InGate, OutGate } from '../gate/type'

export interface IAgent {
  run(): Promise<void>
}

/**
 * Process an item read from Input Gate and write into Output Gate
 */
export class Agent<T extends GateItem, O extends OutGate<any> | { [key: string]: OutGate<any> }> implements IAgent {

  /**
   * @param {InGate} ingate - Input gate
   * @param {OutGate} outgate - Output gate or its map
   */
  constructor(private ingate: InGate<T>, private outgate: O) {
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

    try {
      let item;
      while ((item = await this.ingate.receive()) !== null) {
        const result = await this.main(item, this.outgate);
        if (result !== undefined) {
          await this.sendToOutgate(result);
        }
      }

      //console.info('send null')
      await this.sendToOutgate(null);
    } finally {
      await this.after();
    }
  }
  /**
   * Process main Promise function
   * @param {object} item - read item
   * @param {OutputGate} outgate - Output gate
   * @return {object|array} written item(s). it is an array if output is plural. `undefined` is not written.
   */
  async main(item: T, outgate: O): Promise<any> {
  }

  private async sendToOutgate(item: any) {
    if (this.outgate.send) {
      await (this.outgate as OutGate<any>).send(item)
    } else {
      await Promise.all(Object.values(this.outgate as { [key: string]: OutGate<any> }).map(it => it.send(item)))
    }
  }

  /**
   * Shorthand to create Agent
   * @param  {Gate} ingate   - Input gate
   * @param {Gate|Object<string, Gate>} outgate - Output gate or its map
   * @param  {Promise} main - Process main Promise function
   * @return {Agent} created one
   */
  static create(ingate: InGate<any>, outgate: any, main: (item: any, outgate: any) => Promise<any>): Agent<any, any> {
    const action = new Agent<any, any>(ingate, outgate);
    action.main = main;
    return action;
  }

  /**
   * Start all agents
   * @param  {Agent} ...agents - Agent(s)
   * @return {Promise} A Promise that resolves when all agents have done
   */
  static async all(...agents: IAgent[]): Promise<void> {
    await Promise.all(agents.map(t => t.run()));
  }
}
