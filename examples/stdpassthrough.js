const {
  Agent,
  StdinGate,
  StdoutGate,
} = require('../');

const stdin = new StdinGate();
const stdout = new StdoutGate();

Agent.create(stdin, stdout, async (item) => item).run()
.catch(err => {
  console.error('err', err);
});
