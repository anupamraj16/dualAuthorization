const { UserType } = require('../../types')
const User = require('../../models/User')

const loadUser = {
   type: UserType,
   resolve(parent, args, context) {
      return User.findById(context.user.id)
   },
}

module.exports = { loadUser }
