import mongoose from 'mongoose'
import format from 'date-fns/format/index.js'
import logger from 'loglevel'
import keys from './keys.js'

const connectDB = async () => {
  try {
    await mongoose.connect(keys.mongoURI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
    })

    logger.info(`${format(new Date())} - MongoDB connected`)
  } catch (error) {
    logger.error(`${format(new Date())} - DB Connection Error: ${error.message}`)
    process.exit(-1)
  }
}

export default connectDB
