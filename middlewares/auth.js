const jwt = require('jsonwebtoken')
const User = require('../database/models/User')

module.exports.signToken = (data) => {
   return jwt.sign(data, 'secret_key', { expiresIn: '90d' }) // do not share jwt secret
}

module.exports.isAuthenticated = async (req, res, next) => {
   const authHeader = req.get('Authorization')

   // check for presence of header
   if (!authHeader) {
      req.authenticated = false
      req.authErr = 'No Authorization header is provided.'
   }

   let token, decodedToken
   // decode the jwt
   if (!req.authErr) {
      token = authHeader?.split(' ')[1]

      try {
         decodedToken = jwt.verify(token, 'secret_key') // do not share jwt secret
      } catch (err) {
         req.authenticated = false
         req.authErr = 'JWT has been tampered.'
      }
   }

   // check if user still exists
   let currentUser
   if (!req.authErr) {
      currentUser = await User.findById(decodedToken?.id)
      if (!currentUser) {
         req.authenticated = false
         req.authErr = 'User belonging to this token does not exist.'
      }
   }

   // other authentication related checks

   // if all checks passed- put the user on req.user
   if (currentUser && !req.authErr) {
      req.authenticated = true
      req.user = currentUser
   }

   next()
}

module.exports.isAuthorized = async (req, res, next) => {
   if (
      req.authenticated === true &&
      (req.user.role === 'UserType2' || req.user.role === 'UserType3')
   )
      return next()

   return next(new Error('You are not authorized to use this endpoint'))
}
