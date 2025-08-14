import mongoose from 'mongoose';

// This global variable will hold the cached database connection
let cachedConnection = null;

export async function dbConnect() {
  // If we already have a connection, reuse it
  if (cachedConnection) {
    return cachedConnection;
  }

  // If not, create a new connection
  try {
    const connection = await mongoose.connect(process.env.MONGO_DB_CONNECTION_STRING);
    
    // Cache the connection for future use
    cachedConnection = connection;
    console.log('MongoDB connected successfully');
    return connection;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw new Error('Could not connect to MongoDB');
  }
}
