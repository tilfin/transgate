# Transgate

Task unit framework for JavaScript

## Actors in this framework

* **Gate** is an endpoint of Input/Output. For example, file storage, database or API service.
* **Transaction** is a work between In/Out Gates and does not know anything opposite gate.
* **Item** is a task target unit and an Object or a JSON. `null` indicates a terminator.

## Install

```
npm install -save transgate
```

## Examples

```javascript
const {
  Transaction,
  BufferGate,
  MemoryGate,
  StdoutGate,
} = require('./');

class Value2x extends Transaction {
  async main(item) {
    item.value *= 2;
    return item;
  }
}

const input = new MemoryGate([
  { value: 1 }, { value: 2 },
  { value: 3 }, { value: 4 }
]);
const joint = new BufferGate();
const output = new StdoutGate();

Transaction.start(
  Transaction.create(input, joint, async (item) => {
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
