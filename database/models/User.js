const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const SchemaGenerator = require('./SchemaGenerator')

const collectionName = 'User'
const userSchema = new SchemaGenerator(collectionName, {
   userName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
   },
   password: {
      type: String,
      select: false, // so that by default it is not included in queries
      // validate: a password validator
   },
   role: {
      type: String,
      enum: ['UserType1', 'UserType2', 'UserType3'],
   },
})

// Encrypt the password
userSchema.pre('save', async function (next) {
   if (!this.isModified('password') || !this.password) return next()
   // Hash the password with cost of 12
   this.password = await bcrypt.hash(this.password, 12)
   next()
})

// Compare passwords- instance method
userSchema.methods.isPasswordCorrect = async function (providedPassword) {
   return await bcrypt.compare(providedPassword, this.password)
}

const User = mongoose.model(collectionName, userSchema)

module.exports = User
