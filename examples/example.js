const {
  Agent,
  JointGate,
  MemoryGate,
  StdoutGate,
} = require('../');

class ValueAdd1 extends Agent {
  async main(item, stdoutGate) {
    item.value += 1;
    stdoutGate.send(item);
  }
}

const inputGate = new MemoryGate([
  { value: 1 }, { value: 2 },
  { value: 3 }, { value: 4 }
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
