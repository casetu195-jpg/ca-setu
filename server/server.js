import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import { connectDB } from './config/db.js';
import { errorHandler } from './middleware/error.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Body Parsers & Security Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Production-ready CORS configuration
const clientUrl = process.env.CLIENT_URL;
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  clientUrl,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, same-origin, server-to-server)
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.length === 0 ||
        allowedOrigins.includes(origin) ||
        origin.endsWith('.vercel.app') ||
        origin.endsWith('.onrender.com')
      ) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive for production deployment
    },
    credentials: true,
  })
);

// Connect MongoDB Database on startup
if (process.env.MONGO_URI) {
  connectDB().catch((err) => {
    console.error('Initial DB connection attempt failed:', err.message);
  });
}

// Request-level connection check (vital for Vercel Serverless Function cold starts)
app.use(async (req, res, next) => {
  if (process.env.MONGO_URI && mongoose.connection.readyState !== 1) {
    try {
      await connectDB();
    } catch (err) {
      console.error('Serverless DB reconnect attempt failed:', err.message);
    }
  }
  next();
});

// Production Health Check Endpoint
const healthHandler = (req, res) => {
  const isDbConnected = mongoose.connection.readyState === 1;
  res.json({
    status: 'ok',
    message: 'CA Dwar API Gateway Operational',
    database: isDbConnected ? 'connected' : 'disconnected',
    databaseHost: isDbConnected ? mongoose.connection.host : null,
    databaseState: isDbConnected
      ? 'MongoDB Atlas Connected'
      : 'Running with fallback persistence (Provide MONGO_URI in Vercel to connect Atlas)',
    environment: process.env.NODE_ENV || 'production',
    serverless: !!process.env.VERCEL,
    timestamp: new Date().toISOString(),
  });
};

app.get('/api/health', healthHandler);
app.get('/health', healthHandler);
app.get('/api', (req, res) => res.json({ status: 'ok', message: 'CA Dwar API Serverless Gateway' }));

// Mount Core API Routes (both with /api prefix and relative mount)
app.use('/api/auth', authRoutes);
app.use('/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/applications', applicationRoutes);
app.use('/api/admin', adminRoutes);

// Centralized Error Handling Middleware
app.use(errorHandler);

// Start standalone server only when run locally (NOT in Vercel Serverless Function environment)
if (!process.env.VERCEL && process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`🚀 [CA Dwar Server] Running on Port ${PORT}`);
    console.log(`🎯 [Status] Ready to accept API requests from Client`);
    console.log(`======================================================\n`);
  });
}

export default app;
