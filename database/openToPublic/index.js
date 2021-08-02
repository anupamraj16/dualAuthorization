const { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLNonNull } = require('graphql')

// queries
const { signToken } = require('../../middlewares/auth')
const { AuthType, UserType } = require('../types')
const User = require('../models/User')

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

// mutations
const signUp = {
   type: UserType,
   args: {
      userName: { type: new GraphQLNonNull(GraphQLString) },
      password: { type: new GraphQLNonNull(GraphQLString) },
      passwordConfirm: { type: new GraphQLNonNull(GraphQLString) },
      role: { type: new GraphQLNonNull(GraphQLString) },
   },
   resolve: async function (parent, args) {
      const { userName, password, passwordConfirm, role } = args

      if (password !== passwordConfirm) throw new Error('Passwords do not match. Please try again')

      const newUser = new User({ userName, password, role })
      return await newUser.save()
   },
}

const RootQueries = new GraphQLObjectType({
   name: 'RootQueryType',
   fields: { login },
})

const Mutations = new GraphQLObjectType({
   name: 'Mutation',
   fields: { signUp },
})

module.exports = new GraphQLSchema({
   query: RootQueries,
   mutation: Mutations,
})
