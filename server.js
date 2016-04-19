var thrift = require("thrift");
var Calculator = require("./gen-nodejs/Calculator");
var ttypes = require("./gen-nodejs/bug_types");

var events = []
var number = 0
function addNumber(idx, n) {
  events.push({idx: idx, n: n});
  number += n;
}
function get() {
  return number;
}

var server = thrift.createServer(Calculator, {
  add: function(idx, number) {
    console.log("server: received", idx, "add", number);
    addNumber(idx, number);
  },
  get: function() {
    console.log("server: received get")
    return get();
  },
  crash: function(idx) {
    console.log("server: received crash idx", idx)
    process.exit(1)
  }
}, {
  transport: thrift.TFramedTransport
});

server.listen(9090);