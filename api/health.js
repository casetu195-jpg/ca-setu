import mongoose from 'mongoose';
import { connectDB } from '../server/config/db.js';

export default async function handler(req, res) {
  const hasMongoUri = Boolean(process.env.MONGO_URI);

  if (hasMongoUri && mongoose.connection.readyState !== 1) {
    try {
      await connectDB();
    } catch (err) {
      console.error('Atlas connection error in /api/health:', err.message);
    }
  }

  const isDbConnected = mongoose.connection.readyState === 1;
  const lastError = global.mongoose?.lastError;

  res.setHeader('Content-Type', 'application/json');
  return res.status(200).json({
    status: 'ok',
    message: 'CA Dwar API Gateway Operational',
    hasMongoUri,
    database: isDbConnected ? 'connected' : 'disconnected',
    databaseHost: isDbConnected ? mongoose.connection.host : null,
    databaseState: isDbConnected
      ? 'MongoDB Atlas Connected'
      : hasMongoUri
      ? `Connection Failed: ${lastError || 'Authentication or Network Access issue in Atlas'}`
      : 'MONGO_URI is missing in Vercel Environment Variables',
    environment: process.env.NODE_ENV || 'production',
    serverless: true,
    timestamp: new Date().toISOString(),
  });
}
