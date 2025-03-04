import mongoose from 'mongoose';

// Global connection management
let cachedConnection = null;

export async function dbConnect() {
  // Check if we have a cached connection
  if (cachedConnection) {
    return cachedConnection;
  }

  // Mongoose connection options
  const opts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    family: 4 // Use IPv4, skip trying IPv6
  };

  try {
    // Attempt to connect
    const connection = await mongoose.connect(process.env.MONGO_DB_CONNECTION_STRING, opts);
    
    // Cache the connection
    cachedConnection = connection;

    // Optional: Log successful connection
    console.log('MongoDB connected successfully');

    return connection;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    
    // Implement fallback or retry mechanism
    throw new Error('Could not connect to MongoDB');
  }
}

// Middleware for serverless functions
export async function connectMiddleware(req, res, next) {
  try {
    await connectToDatabase();
    next();
  } catch (error) {
    res.status(500).json({ 
      error: 'Database connection failed', 
      details: error.message 
    });
  }
}
