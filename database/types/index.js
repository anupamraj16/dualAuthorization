const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLNonNull } = require('graphql')

const AuthType = new GraphQLObjectType({
   name: 'Auth',
   fields: () => ({
      id: { type: GraphQLID },
      userName: { type: GraphQLString },
      role: { type: GraphQLString },
      token: { type: GraphQLString },
   }),
})

const UserType = new GraphQLObjectType({
   name: 'UserType',
   fields: () => ({
      id: { type: new GraphQLNonNull(GraphQLID) },
      userName: { type: new GraphQLNonNull(GraphQLString) },
      role: { type: new GraphQLNonNull(GraphQLString) },
      aCommonField: { type: GraphQLString },
      documentStatus: { type: GraphQLString },
   }),
})

const Model1Type = new GraphQLObjectType({
   name: 'Model1Type',
   fields: () => ({
      id: { type: new GraphQLNonNull(GraphQLID) },
      property1: { type: GraphQLString },
      aCommonField: { type: GraphQLString },
      documentStatus: { type: GraphQLString },
   }),
})

const ViewModel1DocResponseType = new GraphQLObjectType({
   name: 'viewModel1DocResponse',
   fields: () => ({
      model1: { type: Model1Type },
      message: { type: GraphQLString },
      err: { type: GraphQLString },
   }),
})

module.exports = { AuthType, UserType, Model1Type, ViewModel1DocResponseType }
