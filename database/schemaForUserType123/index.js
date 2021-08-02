const { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLNonNull } = require('graphql')

const { UserType } = require('../types')
const User = require('../models/User')

// queries
const loadUser = {
   type: UserType,
   resolve(parent, args, context) {
      return User.findById(context.user.id)
   },
}

// mutations
const updateUserPassword = {
   type: GraphQLString,
   args: {
      passwordCurrent: { type: new GraphQLNonNull(GraphQLString) },
      password: { type: new GraphQLNonNull(GraphQLString) },
      passwordConfirm: { type: new GraphQLNonNull(GraphQLString) },
   },
   resolve: async function (parent, args, context) {
      return `${context.user.role} has access to updateUserPassword endpoint`
   },
}

const RootQueries = new GraphQLObjectType({
   name: 'RootQueryType',
   fields: { loadUser },
})

const Mutations = new GraphQLObjectType({
   name: 'Mutation',
   fields: { updateUserPassword },
})

module.exports = new GraphQLSchema({
   query: RootQueries,
   mutation: Mutations,
})
