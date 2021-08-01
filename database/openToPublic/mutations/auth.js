const { GraphQLString, GraphQLNonNull } = require('graphql')
const { UserType } = require('../../types')
const User = require('../../models/User')

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

module.exports = { signUp }
