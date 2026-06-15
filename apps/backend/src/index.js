import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import publicRoutes from './routes/public.js';
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import { notFound, errorHandler } from './middleware/error.js';
import { UPLOAD_DIR } from './middleware/upload.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// --- Middleware ---
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json({ limit: '2mb' }));

// Статика для завантажених зображень
app.use('/uploads', express.static(UPLOAD_DIR));

// --- Health check ---
app.get('/', (req, res) => {
  res.json({
    name: 'IT Blog API',
    status: 'ok',
    version: '1.0.0',
    docs: '/api/articles',
  });
});
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// --- API ---
app.use('/api', publicRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

// --- 404 + помилки ---
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 IT Blog API запущено на порту ${PORT}`);
});

export default app;
