const BufferGate = require('./buffer');
const FileGate = require('./file');
const HttpClientGate = require('./http_client');
const HttpServerGate = require('./http_server');
const MemoryGate = require('./memory');
const StdoutGate = require('./stdout');

module.exports = {
  BufferGate,
  FileGate,
  HttpClientGate,
  HttpServerGate,
  MemoryGate,
  StdoutGate,
}
