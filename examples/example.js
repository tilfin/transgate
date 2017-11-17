const {
  Transaction,
  BufferGate,
  MemoryGate,
  StdoutGate,
} = require('../');

class ValueAdd1 extends Transaction {
  async main(item) {
    item.value += 1;
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
