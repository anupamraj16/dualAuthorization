const { GraphQLSchema, GraphQLObjectType } = require('graphql')

// queries
const { loadUser } = require('./queries/user')
const RootQueries = new GraphQLObjectType({
   name: 'RootQueryType',
   fields: { loadUser },
})

// mutations
const { updateUserPassword } = require('./mutations/auth')
const Mutations = new GraphQLObjectType({
   name: 'Mutation',
   fields: { updateUserPassword },
})

module.exports = new GraphQLSchema({
   query: RootQueries,
   mutation: Mutations,
})
