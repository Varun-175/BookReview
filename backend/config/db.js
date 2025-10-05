// backend/config/db.js (ESM)
import mongoose from 'mongoose';

export async function connectDB() {
  const uri = process.env.MONGO_URI; // e.g. mongodb://127.0.0.1:27017/bookreview
  await mongoose.connect(uri, {
    dbName: process.env.MONGODB_DBNAME || 'bookreview',
  });

  // Optional verification
  console.log(`MongoDB Connected: ${mongoose.connection.host}/${mongoose.connection.name}`);
}
