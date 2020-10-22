require('dotenv').config()

const ApolloServer = require('apollo-server').ApolloServer
const ApolloServerLambda = require('apollo-server-lambda').ApolloServer

const { getConnection } = require('./external/db/mongodb/helpers/dbconnection')

const typeDefs = require('./graphql/schema') 
const resolvers = require('./graphql/resolvers')

function createLambdaServer() {
  return new ApolloServerLambda({
    typeDefs,
    resolvers,
    context: async (req) => {
      const dbConnection = await getConnection()

      return {
        dbConnection,
        req
      }
    },
    introspection: true,
    playground: true
  })
}

function createLocalServer() {
  return new ApolloServer({
    typeDefs,
    resolvers,
    context: async (req) => {
      const dbConnection = await getConnection()

      return {
        dbConnection,
        req
      }
    },
    introspection: true,
    playground: true
  })
}

module.exports = { createLambdaServer, createLocalServer }
