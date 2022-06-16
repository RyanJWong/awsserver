const swarm = require('./controllers/swarm-controller')
// Get instance of Express
const createServer = require('browser-server')
const server = createServer()

server.on('request', function (req, res) {
  swarm.connect(req)
})

server.on('ready', function () {
  console.log("Server is up!")
})

server.on('error', function(req,res, err) {
  res.status(error.code || 500).json({
    message: error.message || 'An unknown error as occured. Try again later.',
  })
})

