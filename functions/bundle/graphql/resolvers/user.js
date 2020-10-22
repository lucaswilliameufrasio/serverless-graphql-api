const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const { decodedToken } = require('../../helpers/decodedToken')

const UserSchema = require('../../external/db/mongodb/schemas/User')

const userResolver = {
  Query: {
    hello: () => "Hi, i'm @lucaswilliameufrasio",
    users: async (root, args, { dbConnection, req }, info) => {
      decodedToken(req)

      const userSchema = UserSchema(dbConnection)

      return userSchema.find().populate()
    }
  },

  Mutation: {
    signupUser: async (root, args, { dbConnection }, info) => {
      const userSchema = UserSchema(dbConnection)

      const {
        data: { email, name, password }
      } = args

      const user = await userSchema.findOne({ email })

      if (user) {
        throw new Error('Email in use')
      }

      const hashedPassword = bcrypt.hashSync(password, 3)

      const newUser = await userSchema.create({
        email,
        name,
        password: hashedPassword
      })

      return { token: jwt.sign(newUser.email, 'supersecret') }
    },

    loginUser: async (root, args, { dbConnection }, info) => {
      const userSchema = UserSchema(dbConnection)

      const {
        data: { email, password }
      } = args

      const theUser = await userSchema.findOne({ email })

      if (!theUser) throw new Error('Unable to Login')
      const isMatch = bcrypt.compareSync(password, theUser.password)

      if (!isMatch) throw new Error('Unable to Login')

      return { token: jwt.sign(theUser.email, 'supersecret') }
    }
  }
}

module.exports = userResolver
