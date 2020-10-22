const { gql } = require('apollo-server-lambda')

module.exports = gql`
  type User {
    name: String!
    email: String!
    password: String!
    id: String
  }

  input UserCreateInput {
    email: String!
    name: String!
    password: String!
  }

  input UserLoginInput {
    email: String!
    password: String!
  }

  type AuthPayload {
    token: String!
  }

  extend type Mutation {
    signupUser(data: UserCreateInput!): AuthPayload!
    loginUser(data: UserLoginInput!): AuthPayload!
  }

  extend type Query {
    hello: String
    users: [User]
  }
`