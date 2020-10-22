const userResolver = require('./user')

const composeResolvers = [userResolver]

module.exports = composeResolvers
