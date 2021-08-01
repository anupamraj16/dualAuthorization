const { ViewModel1DocResponseType } = require('../../types')
const Model1 = require('../../models/Model1')

const viewModel1Doc = {
   type: ViewModel1DocResponseType,
   resolve: async function (parent, args, context) {
      const userRole = context.user.role
      let model1
      try {
         model1 = await Model1.findOne({ property1: 'Model1 doc1' })
      } catch (err) {
         return {
            model1,
            message: `${userRole} is authorized to use viewModel1Doc endpoint`,
            err: err.message,
         }
      }

      return {
         model1,
         message: `${userRole} is authorized to use viewModel1Doc endpoint and to view Model1 documents`,
      }
   },
}

module.exports = { viewModel1Doc }
