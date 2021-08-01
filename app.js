// import npm packages
const express = require('express')
const bodyParser = require('body-parser')
const { graphqlHTTP } = require('express-graphql')

// import graphQL schemas
const openToPublic = require('./database/openToPublic')
const schemaForUserType123 = require('./database/schemaForUserType123')
const schemaNotForUserType1 = require('./database/schemaNotForUserType1')

// import authentication and authorization middlewares
const { isAuthenticated, isAuthorized } = require('./middlewares/auth')

// create express app
const app = express()

// body parser to read req.body- configure according to project requirements
app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }))

// Authentication middleware- checks if a valid JWT and valid user- no error or blocking of request
app.use(isAuthenticated)

// Make user role available in Mongoose Models
app.use(async function (req, res, next) {
   module.exports.currentUser = req.user
   next()
})

// Open to public access- no login/authentication required
app.use(
   '/openToPublic',
   graphqlHTTP({
      schema: openToPublic,
      graphiql: true, // to enable the GraphQL interface in browser
   })
)

// if not authenticated, block the request and handle error
app.use(function (req, res, next) {
   if (req.authErr)
      // any argument passed to next triggers error in express
      next(new Error(req.authErr))

   next()
})

// Availbale only after login- avalable to UserType- 1, 2 and 3
app.use('/afterLogin', graphqlHTTP({ schema: schemaForUserType123 }))

// Authorization middleware- blocks UserType1 but allows UserType2 and UserType3
app.use(isAuthorized)

// only UserType- 2 and 3 are allowed to move ahead
app.use('/afterAuthorization', graphqlHTTP({ schema: schemaNotForUserType1 }))

// Global Error Handling Middleware
app.use((err, req, res, next) => {
   err.status = err.status || 'error'

   res.send({
      status: err.status,
      message: 'Express Global Error Handling Middleware: ' + err.message,
   })
})

module.exports = { app }
