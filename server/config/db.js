import mongoose from 'mongoose';

/**
 * Global is used here to maintain a cached connection across hot-reloads
 * in development and serverless function executions in production (Vercel).
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null, lastError: null };
}

export async function connectDB() {
  const mongoURI = process.env.MONGO_URI;

  if (!mongoURI) {
    console.warn('⚠️ [CA Setu Backend] MONGO_URI is not set in environment variables.');
    return null;
  }

  // If connection already established, return cached connection
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  // If a connection promise is in progress, await it
  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Disable Mongoose buffering for serverless
      maxPoolSize: 10,       // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    };

    console.log('🔄 Connecting to MongoDB Atlas...');
    cached.promise = mongoose.connect(mongoURI, opts).then((mongooseInstance) => {
      console.log(`✅ [MongoDB Connected] Database Host: ${mongooseInstance.connection.host}`);
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
    cached.lastError = null;
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    cached.lastError = error.message;
    console.error(`❌ [MongoDB Connection Error]: ${error.message}`);
    return null;
  }
}
