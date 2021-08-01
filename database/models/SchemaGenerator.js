const mongoose = require('mongoose')

const Schema = mongoose.Schema

// permissions for Model1 for UserType2 and UserType3
const READ_PERMISSION_FOR_USER_2_FOR_MODEL_1 = false
const READ_PERMISSION_FOR_USER_3_FOR_MODEL_1 = true

function SchemaGenerator(collectionName, data) {
   let wholeData = {
      ...data,
      aCommonField: {
         type: String,
         default: 'this is a common filed available across all collections',
      },
      documentStatus: {
         type: String,
         default: 'active',
         enum: ['active', 'inactive'],
      },
   }

   let schema = new Schema(wholeData)

   // create or over-ride static functions
   schema.statics.someCustomFunction = function (query) {
      // your awesome code here
   }

   schema.pre(/^find/, function (next) {
      const { currentUser } = require('../../app')

      // assign user role
      let currentUserRole
      if (currentUser) currentUserRole = currentUser.role
      if (!currentUserRole) currentUserRole = 'Public'

      // return only active documents- apply some global filter
      this.find({ documentStatus: { $eq: 'active' } })

      // Allow user to go ahead if he has permission to read data from the collection
      if (
         currentUserRole === 'UserType2' &&
         collectionName === 'Model1' &&
         READ_PERMISSION_FOR_USER_2_FOR_MODEL_1
      )
         next()
      else if (
         currentUserRole === 'UserType3' &&
         collectionName === 'Model1' &&
         READ_PERMISSION_FOR_USER_3_FOR_MODEL_1
      )
         next()
      // export the query name from app and
      // allow the query to move forward based on query name
      // in this example- user collection is kept open to public so that login query can move forward
      if (collectionName === 'User') next()
      // Or block him if role doesn't have enough permissions
      else
         throw new Error(`${currentUserRole} is not authorized to view ${collectionName} documents`)
   })

   // Similar logic can be added for other pre and post mongoose middlewares

   return schema
}

module.exports = SchemaGenerator
