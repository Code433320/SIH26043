import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import problemsRoutes from './routes/problems.routes.js';
import solutionsRoutes from './routes/solutions.routes.js';
import engagementsRoutes from './routes/engagements.routes.js';
import discussionsRoutes from './routes/discussions.routes.js';
import { errorMiddleware } from './middleware/error.middleware.js';

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(',') || '*',
    credentials: true,
  })
);
app.use(express.json());

// Health check — useful for confirming the server is up during demo setup
app.get('/health', (req, res) => res.json({ success: true, message: 'API is running' }));

// Resource routes — add solutions/engagements/discussions/dashboard here
// as you build them, following the same pattern as problems.routes.js
app.use('/api/problems', problemsRoutes);
app.use('/api/solutions', solutionsRoutes);
app.use('/api/engagements', engagementsRoutes);
app.use('/api/discussions', discussionsRoutes);

// 404 handler — anything that didn't match a route above
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Centralized error handler — MUST be registered last
app.use(errorMiddleware);

export default app;
