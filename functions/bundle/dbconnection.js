const mongoose = require('mongoose')


const MONGODB_URI =
    process.env.MONGODB_URI || 'mongodb://localhost:27017/lambda'

let conn = null

const getConnection = async () => {
    if (conn === null) {
        conn = mongoose.createConnection(MONGODB_URI, {
            bufferCommands: false,
            bufferMaxEntries: 0,
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
        })
    }

    return conn
}

module.exports = {
    getConnection
}