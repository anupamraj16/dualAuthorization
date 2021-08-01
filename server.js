// npm packages
const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config({ path: `${__dirname}/config.env` })

const { app } = require('./app')

process.on('uncaughtException', (err) => {
   console.log(err.name, err.message)
   process.exit(1)
})

// connect to DB- provide your own DB credentials
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

// start the server
const PORT = process.env.PORT || 5000
const server = app.listen(PORT, () => console.log('Server is running on Port', PORT))

process.on('unhandledRejection', (err) => {
   console.log(err)
   server.close(() => {
      process.exit(1)
   })
})
