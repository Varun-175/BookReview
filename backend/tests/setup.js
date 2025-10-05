import { connectDB, disconnectDB } from '../config/db.js'
import dotenv from 'dotenv'
dotenv.config({ path: '.env' })

beforeAll(async () => {
  const uri = process.env.MONGO_URI
  if (!uri) throw new Error('MONGO_URI missing for tests')
  await connectDB(uri)
}, 30000)

afterAll(async () => {
  await disconnectDB()
})
