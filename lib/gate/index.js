const JointGate = require('./joint');
const ReadFileGate = require('./read_file');
const WriteFileGate = require('./write_file');
const HttpClientGate = require('./http_client');
const HttpServerGate = require('./http_server');
const MemoryGate = require('./memory');
const StdinGate = require('./stdin');
const StdoutGate = require('./stdout');

module.exports = {
  JointGate,
  ReadFileGate,
  WriteFileGate,
  HttpClientGate,
  HttpServerGate,
  MemoryGate,
  StdinGate,
  StdoutGate,
}
