const { GraphQLString, GraphQLNonNull } = require('graphql')

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

module.exports = { updateUserPassword }
