import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import githubRoutes from './routes/github.routes';
import analysisRoutes from './routes/analysis.routes';
import compareRoutes from './routes/compare.routes';
import { errorHandler } from './middleware/error.middleware';

dotenv.config();

const app: Application = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(helmet());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/github', githubRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api/compare', compareRoutes);

// Error Handler
app.use(errorHandler);

export default app;
