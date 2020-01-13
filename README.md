# Transgate

[![npm](https://img.shields.io/npm/v/transgate.svg)](https://www.npmjs.com/package/transgate)
[![Node](https://img.shields.io/node/v/transgate.svg)]()
[![document](https://img.shields.io/badge/document-0.6.0-orange.svg)](https://tilfin.github.io/transgate/transgate/0.6.0/)
[![License](https://img.shields.io/github/license/tilfin/transgate.svg)]()
[![dependencies Status](https://david-dm.org/tilfin/transgate/status.svg)](https://david-dm.org/tilfin/transgate)
[![Build Status](https://travis-ci.org/tilfin/transgate.svg?branch=master)](https://travis-ci.org/tilfin/transgate)
[![Coverage Status](https://coveralls.io/repos/github/tilfin/transgate/badge.svg?branch=master)](https://coveralls.io/github/tilfin/transgate?branch=master)

Agent-based task flow framework for Node.js

## Install

```
npm install -save transgate
```

## Actors in this framework

* **Gate** is an endpoint of Input/Output. For example, file storage, database, queue or API service.
* **Agent** is a worker to process an **item** between Input/Output **gates** and does not know anything opposite **gates**.
* **Item** is an entity as each task target, to be exchanged between **gates**, and an *Object* or a *JSON*. `null` indicates the terminator.

## How it works

1. A **agent** receives an **item** from a **gate** for Input.
2. The **agent** processes an **item**.
3. According to need the **Agent** sends the results as next **item(s)** to some gate(s) for Output.

If the **agent** receives `null` as an **item**, sends `null` to all next **gates** and closes itself.

* All agents must be given gates for input and output in the constructor and run independently.
* A gate is easy to replace because the interface of the item is a simple *Object*.

## Implements

### Gate

* A gate for Input must implement `receive` *Promise* method that resolves an **item**.
* A gate for Output must implement `send` *Promise* method with argument an **item**. `send` resolves when completes to write the item.

### Agent

* An agent inherits `Agent` class and overrides `async main(item, outGate)` method to process an `item` and send it to `outGate`.
* To create an agent instance is to call `new YourAgent(inGate, outGate)`. If the `outGate` is plural, it need be replaced with key-value-based `{ outGate1, outGate2 }` in order to have `async main(item, { outGate1, outGate2 })`.
* If the agent uses any daemon, overrides `async before()` to launch it and `async after()` to shut down it.

### Starting

To start agents is calling `Agent.all(...yourAgents)` *Promise* method. If you use any daemons in some gates, They should be shut down after `all` *Promise* has done.

## Standard Gate classes

There are the following gates in this library.

* MemoryGate - Supports both Input/Output for test
* ReadFileGate - Reading each line as an item from a file for Input
* WriteFileGate - Writing sended items to a file for Output
* HttpServerGate - Receiving an item that is a body POSTed by HTTP client for Input
* HttpClientGate - Sending an item as POST request body to fixed HTTP server endpoint for Output
* IntervalGate - Providing an item contains the time every interval passing for Input
* StdinGate - Reading each line as an item from stdin for Input
* StdoutGate - Writing sended items to stdout for Output
* JointGate - Pipes an agent to another one

## Converter for Gate
* mixer - Receiving items from some gates for Input
* duplicator - Sending an item the multiple gates for Output

## An example

### About agents
1. (No name)   : item.value x 2
2. `ValueAdd1` : item.value + 1

### About connections between agent and gates
* memory --> Agent1 --> joint
* joint  --> Agent2 --> stdout

```javascript
const {
  Agent,
  JointGate,
  MemoryGate,
  StdoutGate,
} = require('transgate');

class ValueAdd1 extends Agent {
  async main(item, stdoutGate) {
    item.value += 1;
    stdoutGate.send(item);
  }
}

const inputGate = new MemoryGate([
  { value: 1 }, { value: 2 }, { value: 3 }, { value: 4 }
]);
const joint = new JointGate();
const stdoutGate = new StdoutGate();

Agent.all(
  Agent.create(inputGate, joint, async (item) => {
    item.value *= 2;
    return item;
  }),
  new ValueAdd1(joint, stdoutGate),
)
.catch(err => {
  console.error(err);
});
```

#### The result stdout

```json
{"value":3}
{"value":5}
{"value":7}
{"value":9}
```

## Reference articles
- [Transgate is Agent-based taskflow framework for Node.js - dev.to](https://dev.to/tilfin/transgate-is-agent-based-taskflow-framework-for-nodejs-58b)
