# Transgate

[![npm](https://img.shields.io/npm/v/transgate.svg)](https://www.npmjs.com/package/transgate)
[![Node](https://img.shields.io/node/v/transgate.svg)]()
[![document](https://img.shields.io/badge/document-0.1.0-orange.svg)](https://tilfin.github.io/transgate/transgate/0.1.0/)
[![License](https://img.shields.io/github/license/tilfin/transgate.svg)]()
[![Build Status](https://travis-ci.org/tilfin/transgate.svg?branch=master)](https://travis-ci.org/tilfin/transgate)
[![Coverage Status](https://coveralls.io/repos/github/tilfin/transgate/badge.svg?branch=master)](https://coveralls.io/github/tilfin/transgate?branch=master)

Unit agent flow framework for Node.js

## Actors in this framework

* **Gate** is an endpoint of Input/Output. For example, file storage, database or API service.
* **Agent** is a worker to process an item between Input/Output gates and does not know anything opposite gates.
* **Item** is a task target unit and an Object or a JSON. `null` indicates a terminator.

## Install

```
npm install -save transgate
```

## Examples

```javascript
const {
  Agent,
  JointGate,
  MemoryGate,
  StdoutGate,
} = require('../');

class ValueAdd1 extends Agent {
  async main(item, output) {
    item.value += 1;
    output.write(item);
  }
}

const input = new MemoryGate([
  { value: 1 }, { value: 2 },
  { value: 3 }, { value: 4 }
]);
const joint = new JointGate();
const output = new StdoutGate();

Agent.all(
  Agent.create(input, joint, async (item) => {
    item.value *= 2;
    return item;
  }),
  new ValueAdd1(joint, output),
)
.catch(err => {
  console.error(err);
});
```

```json
{"value":3}
{"value":5}
{"value":7}
{"value":9}
```
