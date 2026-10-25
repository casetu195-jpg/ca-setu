import mongoose from 'mongoose';
import { connectDB } from '../server/config/db.js';

export default async function handler(req, res) {
  // Ensure MongoDB Atlas is connected
  try {
    await connectDB();
  } catch (err) {
    console.error('Atlas connection error in /api/health:', err.message);
  }

  const isDbConnected = mongoose.connection.readyState === 1;

  res.setHeader('Content-Type', 'application/json');
  return res.status(200).json({
    status: 'ok',
    message: 'CA Setu API Gateway Operational',
    database: isDbConnected ? 'connected' : 'disconnected',
    databaseHost: isDbConnected ? mongoose.connection.host : null,
    databaseState: isDbConnected
      ? 'MongoDB Atlas Connected'
      : 'Disconnected (Check MONGO_URI in Vercel Environment Variables)',
    environment: process.env.NODE_ENV || 'production',
    serverless: true,
    timestamp: new Date().toISOString(),
  });
}
