const mongoose = require('mongoose')
const SchemaGenerator = require('./SchemaGenerator')

const collectionName = 'Model1'
const model1Schema = new SchemaGenerator(collectionName, {
   property1: {
      type: String,
      default: 'Model1 document',
   },
})

const Model1 = mongoose.model(collectionName, model1Schema)

module.exports = Model1
