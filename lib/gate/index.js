const JointGate = require('./joint');
const FileGate = require('./file');
const HttpClientGate = require('./http_client');
const HttpServerGate = require('./http_server');
const MemoryGate = require('./memory');
const StdoutGate = require('./stdout');

module.exports = {
  JointGate,
  FileGate,
  HttpClientGate,
  HttpServerGate,
  MemoryGate,
  StdoutGate,
}
