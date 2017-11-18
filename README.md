# Transgate

[![npm](https://img.shields.io/npm/v/transgate.svg)](https://www.npmjs.com/package/transgate)
[![Node](https://img.shields.io/node/v/transgate.svg)]()
[![document](https://img.shields.io/badge/document-0.3.0-orange.svg)](https://tilfin.github.io/transgate/transgate/0.3.0/)
[![License](https://img.shields.io/github/license/tilfin/transgate.svg)]()
[![Build Status](https://travis-ci.org/tilfin/transgate.svg?branch=master)](https://travis-ci.org/tilfin/transgate)
[![Coverage Status](https://coveralls.io/repos/github/tilfin/transgate/badge.svg?branch=master)](https://coveralls.io/github/tilfin/transgate?branch=master)

Agent based task flow framework for Node.js

## Install

```
npm install -save transgate
```

## Actors in this framework

* **Gate** is an endpoint of Input/Output. For example, file storage, database, queue or API service.
* **Agent** is a worker to process an **item** between Input/Output **gates** and does not know anything opposite **gates**.
* **Item** is an entity as each task target, to be exchanged between **gates** and an *Object* or a *JSON*. `null` indicates the terminator.

## How it works

1. A **agent** receives an **item** from a **gate** for Input.
2. The **agent** processes an **item**.
3. According to need the **Agent** sends the results as next **item(s)** to some gate(s) for Output.

If the **agent** receives `null` as an **item**, sends `null` to all next **gates** and closes itself.

* All agents must be given gates for input and output in the constructor and run independently.
* A gate is easy to replace because the interface of the item is a simple *Object*.

## Standard gates

There are the following gates in this library.

* MemoryGate - For test, supports both Input/Output
* ReadFileGate - Reading each line as an item from a file for Input
* WriteFileGate - Writing sended items to a file for Output
* HttpServerGate - Receiving an item that is a body POSTed by HTTP client for Input
* HttpClientGate - Sending an item as POST request body to fixed HTTP server endpoint for Output
* StdinGate - Reading each line as item from stdin for Input
* StdoutGate - Writing sended items to stdout for Output
* JointGate - Pipes an agent to another one

## An example

### Agents
* Agent1 : item.value x 2
* Agent2 : item.value + 1

### Connection agent with gates
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
  async main(item, output) {
    item.value += 1;
    output.write(item);
  }
}

const memory = new MemoryGate([
  { value: 1 }, { value: 2 },
  { value: 3 }, { value: 4 }
]);
const joint = new JointGate();
const stdout = new StdoutGate();

Agent.all(
  Agent.create(memory, joint, async (item) => {
    item.value *= 2;
    return item;
  }),
  new ValueAdd1(joint, stdout),
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

