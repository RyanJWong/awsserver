const fs = require('fs');
const tools = require ("./tools");

const Hyperbeam = require('hyperbeam');
const util = require('util')

function hook_stdout(callback) {
  var old_write = process.stdout.write

  process.stdout.write = (function(write) {
      return function(string, encoding, fd) {
          write.apply(process.stdout, arguments)
          callback(string, encoding, fd)
      }
  })(process.stdout.write)

  return function() {
      process.stdout.write = old_write
  }
}

var unhook = hook_stdout(function(string, encoding, fd) {
  util.debug('stdout: ' + util.inspect(string))
})

async function createChannel(channelID, code) {
  console.log('connecting to channID ' + channelID)
  console.log(`using code ${code}`)

  const beam = new Hyperbeam(channelID)

  beam.on('remote-address', async function ({ host, port }) {
    if (!host) console.error('[hyperbeam] Could not detect remote address')
    else
      console.log(
        '[hyperbeam] Joined the DHT - remote address is ' + host + ':' + port,
      )
    if (port) {
      console.log('[hyperbeam] Network is holepunchable \\o/')
      //await sleep(1000)
    }
  })

  beam.on('data', data => {
    process.stdout.write("\n"+data +"\n")
  })
  beam.on('connected', function () {
    console.log(
      '[hyperbeam] Success! Encrypted tunnel established to remote peer',
    )
  })
 





  unhook()

  beam.on('end', () => {
    beam.end(beam.read)
    process.stdin.pipe(beam).pipe('NO ONE IS FUCKING HERE')
  })

  process.once('SIGINT', () => {
    if (!beam.connected) closeASAP()
    else beam.end()
  })

  function closeASAP() {
    console.error('[hyperbeam] Shutting down beam...')

    const timeout = setTimeout(() => process.exit(1), 2000)
    beam.destroy()
    beam.on('close', function () {
      clearTimeout(timeout)
    })
  }
  return beam
}

exports.createChannel = createChannel
