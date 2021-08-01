const { GraphQLString, GraphQLNonNull } = require('graphql')
const { signToken } = require('../../../middlewares/auth')
const { AuthType } = require('../../types')
const User = require('../../models/User')

const login = {
   type: AuthType,
   args: {
      userName: { type: new GraphQLNonNull(GraphQLString) },
      password: { type: new GraphQLNonNull(GraphQLString) },
   },
   async resolve(parent, args, context) {
      let { userName, password } = args
      userName = userName.trim().toLowerCase()

      if (!userName || !password) throw new Error('Please provide required fields')
      const userFound = await User.findOne({ userName }).select('+password')
      if (!userFound) throw new Error('Invalid credentials')
      const result = await userFound.isPasswordCorrect(password)
      if (!result) throw new Error('Invalid credentials')

      // Sign the JWT token
      const token = signToken({ id: userFound.id })

      return {
         id: userFound.id,
         userName: userFound.userName,
         role: userFound.role,
         token,
      }
   },
}

module.exports = { login }
