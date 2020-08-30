const { createLambdaServer } = require('./bundle/server')
const mongoose = require('mongoose')

const server = createLambdaServer()

const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/lambda'

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
})
const db = mongoose.connection

db.on('error', console.error.bind(console, 'connection error:'))

exports.handler = server.createHandler({
  cors: {
    origin: '*'
  }
})
