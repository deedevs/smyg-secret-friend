import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import { config } from './config';
import { rateLimit } from './middleware/rateLimit';

// Import routes
import authRoutes from './routes/auth';
import secretRoutes from './routes/secret';
import adminRoutes from './routes/admin';
import wishlistRoutes from './routes/wishlist';

const app = express();

// Security middleware
app.use(helmet());
app.use(morgan(config.isDev ? 'dev' : 'combined'));

// Basic middleware
app.use(express.json());
app.use(cookieParser());
app.use(rateLimit);
app.use(cors(config.cors));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/secret', secretRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/wishlist', wishlistRoutes);

// Error handling
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ 
    status: 'error',
    message: config.isDev ? err.message : 'Something went wrong!' 
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Not Found'
  });
});

export default app;