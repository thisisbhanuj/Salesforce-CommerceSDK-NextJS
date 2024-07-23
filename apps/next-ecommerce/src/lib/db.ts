import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

interface MongoConnection {
  conn: mongoose.Connection | null;
  promise: Promise<mongoose.Connection> | null;
}

let cached: MongoConnection = { conn: null, promise: null };

async function connectDB(): Promise<mongoose.Connection> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: true, // Adjust options as needed
    };
    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongoose) => mongoose.connection);
  }

  try {
    cached.conn = await cached.promise;
    console.log('MongoDB Connection Success');
    return cached.conn;
  } catch (error) {
    console.error('MongoDB Connection Failed', error);
    cached.promise = null;
    throw error; // Re-throw the error for handling
  }
}

export default connectDB;
