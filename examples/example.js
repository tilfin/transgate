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
