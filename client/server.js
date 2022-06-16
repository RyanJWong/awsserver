// Variables created as part of global object are available everywhere in the project.
// Using Global Variables in Node.js
// https://stackabuse.com/using-global-variables-in-node-js/
global.serverPort = 4000
// Using MongoDB Explain with Mongoose
// https://masteringjs.io/tutorials/mongoose/explain
// Parameters (explainations)
//  .explain('queryPlanner'), .explain('executionStats'), or .explain('allPlansExecution'). Default: 'queryPlanner'.
// .explain('true') shows all explainations. Does not run the query.
// .explain('false') shows no explainations. Runs query.
// Query Planner output:
// winningPlan is useful for checking whether MongoDB used an index for the query or not.
// stage: 'COLLSCAN' means an index was NOT used.
// inputStage: ... stage: 'IXSCAN' means an index was used, its name is given by the indexName property.

// Schema based data modeling for mongodb
// https://mongoosejs.com/docs/mongoose
// Whats difference btween ODM and ORM?

// HTTP request logger
// how to use morgan in your express project
const morgan = require('morgan')
const HttpError = require('./models/http-error')
const express = require('express')
const path = require('path')
// Custom error class
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

