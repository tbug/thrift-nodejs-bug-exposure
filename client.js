var thrift = require('thrift')
var Calculator = require('./gen-nodejs/Calculator')
var async = require('async')

transport = thrift.TBufferedTransport()

var connection = thrift.createConnection("localhost", 9090, {
  max_attempts: Number.MAX_VALUE,
  transport: thrift.TFramedTransport
});

connection.on('error', function (err) {
  console.log('client: thrift connection error (but we choose to ignore it)')
})
connection.on('close', function (err) {
  throw new Error('client: exceeded reconnection max_attempts, give up')
})

// Create a Calculator client with the connection
var client = thrift.createClient(Calculator, connection)

var clientAddIndex = 0

setInterval(function () {
  var adds = [clientAddIndex++, clientAddIndex++]

  async.eachSeries(adds, function work (idx, callback) {
    console.log("client: sending add, idx:", idx)
    client.add(idx, 1, callback)
  }, function done () {
    console.log("client: sending get")
    client.get(function (err, res) {
      if (err) {
        throw err
      } else {
        console.log("client: get responded with:", res)
      }
    })
  })

}, 2200)

setInterval(function () {
  console.log("client: sending crash")
  client.crash(function (err) {})
}, 5000)