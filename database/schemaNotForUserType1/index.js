const { GraphQLSchema, GraphQLObjectType } = require('graphql')

// queries
const { viewModel1Doc } = require('./queries')
const RootQueries = new GraphQLObjectType({
   name: 'RootQueryType',
   fields: { viewModel1Doc },
})

module.exports = new GraphQLSchema({
   query: RootQueries,
})
