require('dotenv').config()

const ApolloServer = require('apollo-server').ApolloServer
const ApolloServerLambda = require('apollo-server-lambda').ApolloServer
const { gql } = require('apollo-server-lambda')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const { decodedToken } = require('./decodedToken')

const UserSchema = require('./schemas/User')

const typeDefs = gql`
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

  type Mutation {
    signupUser(data: UserCreateInput!): AuthPayload!
    loginUser(data: UserLoginInput!): AuthPayload!
  }

  type Query {
    hello: String
    users: [User]
  }
`

const resolvers = {
  Query: {
    hello: () => "Hi, i'm @lucaswilliameufrasio",
    users: async (root, args, { UserSchema, req }, info) => {
      const decoded = decodedToken(req)

      return UserSchema.find().populate()
    }
  },

  Mutation: {
    signupUser: async (root, args, { UserSchema }, info) => {
      const {
        data: { email, name, password }
      } = args

      const hashedPassword = bcrypt.hashSync(password, 3)
      const newUser = await UserSchema.create({
        email,
        name,
        password: hashedPassword
      })

      return { token: jwt.sign(newUser.email, 'supersecret') }
    },

    loginUser: async (root, args, { UserSchema }, info) => {
      const {
        data: { email, password }
      } = args

      const theUser = await UserSchema.findOne({ email })

      if (!theUser) throw new Error('Unable to Login')
      const isMatch = bcrypt.compareSync(password, theUser.password)

      if (!isMatch) throw new Error('Unable to Login')

      return { token: jwt.sign(theUser.email, 'supersecret') }
    }
  }
}

function createLambdaServer() {
  return new ApolloServerLambda({
    typeDefs,
    resolvers,
    context: (req) => ({
      UserSchema,
      req
    }),
    introspection: true,
    playground: true
  })
}

function createLocalServer() {
  return new ApolloServer({
    typeDefs,
    resolvers,
    context: (req) => ({
      UserSchema,
      req
    }),
    introspection: true,
    playground: true
  })
}

module.exports = { createLambdaServer, createLocalServer }
