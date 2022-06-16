// Use object de-structuring
const b64 = require('b64')
const hyperswarm = require('hyperswarm-web')
const request = require('request')
const { exec } = require('child_process')
const crypto = require('crypto')
let { createChannel, reso } = require('../libraries/mock.js')
var currentFill;

const swarm = hyperswarm()



swarm.on('connection', (conn, info) => {
  // swarm will receive server connections

  process.stdin.pipe(conn).pipe(process.stdout)

  conn.on('data', (data) => console.log('Connection:', decode(data.toString())))
})

swarm.on('disconnection', (conn, details) => {
  console.log(details.peer.host, 'disconnected!')
  console.log('now we have', swarm.peers.length, 'peers!')
})

const lambda = async (req, res, next) => {
  exec('docker run node:alpine', (error, stdout, stderr) => {
    if (error) {
      return res.status(400).json({ error: error.message })
    }
    if (stderr) {
      return res.status(400).json({ stderr: stderr })
    }
    return res.json({ message: stdout })
  })
}

const executeCodeRequest = async (req, res, next) => {
  let { code, event } = req.body
  console.log(Object.keys(req))
  console.log(req['body'])
  console.log(req['headers'])
  console.log(code)
  console.log(event)
  let response = await createChannel(req['headers'].event, req['headers'].code)
  console.log(response)
  return res.json({
    message: response
  })
}
const resolve = async (req,res,next) =>{ 
  let response = reso(req['headers'].event, req['headers'].code)

  return res.json({
    message: response
  })
}
const getKey = async (req, res, next) => {
  res.json({fill: currentFill })
}

const connect = async (req, res, next) => {
  let { fill } = req.body
  let newTopic = crypto.createHash('sha256').update(fill).digest()

  if (currentFill == fill) {
    res.json({ message: 'Hyper core is already connected to topic' })
  } else {
    swarm.join(newTopic)
    topic = newTopic
    currentFill = fill
    res.json({
      message:
        'Hyper core successfully connected to new topic: ' +
        JSON.stringify(newTopic),
    })
  }
}

function encode(data) {
  let uEnv = b64.base64urlEncode(data)
  return String(uEnv)
}

function decode(encoded) {
  let uEnv = b64.base64urlDecode(encoded)
  return String(uEnv)
}

const message = async (req, res, next) => {
  let data = encode(String(req.body.data))
  console.log(data)
  res.json({ base64String: data })
}

module.exports = {
  getKey,
  connect,
  message,
  encode,
  decode,
  executeCodeRequest,
  lambda,
  resolve,
}
