const { GraphQLSchema, GraphQLObjectType } = require('graphql')

// queries
const { login } = require('./queries/auth')
const RootQueries = new GraphQLObjectType({
   name: 'RootQueryType',
   fields: { login },
})

// mutations
const { signUp } = require('./mutations/auth')
const Mutations = new GraphQLObjectType({
   name: 'Mutation',
   fields: { signUp },
})

module.exports = new GraphQLSchema({
   query: RootQueries,
   mutation: Mutations,
})
