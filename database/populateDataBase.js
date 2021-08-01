const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config({ path: '../config.env' })

const User = require('./models/User')
const Model1 = require('./models/Model1')

const users = [
   new User({
      userName: 'abc',
      password: 'Testing1234!',
      role: 'UserType1',
   }),
   new User({
      userName: 'def',
      password: 'Testing1234!',
      role: 'UserType2',
   }),
   new User({
      userName: 'ghi',
      password: 'Testing1234!',
      role: 'UserType3',
   }),
]

const model1docs = [
   new Model1({
      property1: 'Model1 doc1',
   }),
   new Model1({
      property1: 'Model1 doc2',
   }),
   new Model1({
      property1: 'Model1 doc3',
   }),
]

const db = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD).replace(
   '<DB_NAME>',
   process.env.DATABASE_NAME
)
mongoose
   .connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
   })
   .then((connected) => {
      if (connected) console.log('MongoDB connected')
   })
   .catch((err) => console.log(err))

// Import Data into DB
const importData = async () => {
   try {
      console.log('starting function...')
      await User.deleteMany()
      await Model1.deleteMany()

      await User.create(users)
      await Model1.create(model1docs)

      console.log('Data successfully loaded...')
      process.exit()
   } catch (err) {
      console.log(err)
      process.exit()
   }
}

// Delete all data from DB
const deleteData = async () => {
   try {
      await User.deleteMany()
      await Model1.deleteMany()

      console.log('Data successfully deleted...')
      process.exit()
   } catch (err) {
      console.log(err)
   }
}

// command signature: node <filename> --<option>
// example: node populateDataBase.js --import
if (process.argv[2] === '--import') {
   importData()
} else if (process.argv[2] === '--delete') {
   deleteData()
}
