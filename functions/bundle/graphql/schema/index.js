const { gql } = require('apollo-server-lambda')

const userSchema = require('./user')

const linkSchema = gql`
  type Query {
    _: Boolean
  }

  type Mutation {
    _: Boolean
  }

  type Subscription {
    _: Boolean
  }
`

const composeSchema = [linkSchema, userSchema]

module.exports = composeSchema
