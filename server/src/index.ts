import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import dotenv from 'dotenv';

import { runMigrations } from './db/migrate.ts';
import authRoutes from './routes/auth.routes.ts';
import farmRoutes from './routes/farm.routes.ts';
import diagnosticRoutes from './routes/diagnostic.routes.ts';
import plannerRoutes from './routes/planner.routes.ts';
import fertilizerRoutes from './routes/fertilizer.routes.ts';
import irrigationRoutes from './routes/irrigation.routes.ts';
import chatRoutes from './routes/chat.routes.ts';
import { errorHandler } from './middleware/errorHandler.ts';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middlewares
app.use(helmet({ contentSecurityPolicy: false }));
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate Limiters
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 200,
  message: { success: false, error: 'Too many requests from this IP, please try again later.' },
});

const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30, // 30 AI requests per 15 minutes to protect quota
  message: { success: false, error: 'AI rate limit exceeded. Please wait a few minutes before submitting new scans.' },
});

app.use('/api', generalLimiter);
app.use('/api/diagnostics/analyze', aiLimiter);
app.use('/api/chat/message', aiLimiter);

// Route Mounting
app.use('/api/auth', authRoutes);
app.use('/api/farms', farmRoutes);
app.use('/api/diagnostics', diagnosticRoutes);
app.use('/api/planner', plannerRoutes);
app.use('/api/fertilizer', fertilizerRoutes);
app.use('/api/irrigation', irrigationRoutes);
app.use('/api/chat', chatRoutes);

// Serve Frontend Production Assets
const distPath = path.join(process.cwd(), 'dist');
app.use(express.static(distPath));

// Health Check API
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    application: 'AgriSmart AI Server',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// SPA Fallback to index.html for non-API routes
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  const indexPath = path.join(distPath, 'index.html');
  res.sendFile(indexPath);
});

// Centralized Error Handling
app.use(errorHandler);

// Initialize DB and Start Express Server
async function startServer() {
  try {
    await runMigrations();
    app.listen(PORT, () => {
      console.log(`🚀 AgriSmart AI Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Failed to start AgriSmart server:', err);
    process.env.NODE_ENV !== 'test' && process.exit(1);
  }
}

startServer();
