const { createLocalServer } = require('./server')
const mongoose = require('mongoose')

const server = createLocalServer()

const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/lambda'

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
})
const db = mongoose.connection

db.on('error', console.error.bind(console, 'connection error:'))

db.once('open', () => {
  server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`)
  })
})
