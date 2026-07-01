import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createProxyMiddleware } from 'http-proxy-middleware';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

// Proxy configuration - sử dụng pathFilter để giữ nguyên path gốc
app.use(createProxyMiddleware({
  target: 'http://auth-service:5002',
  changeOrigin: true,
  pathFilter: '/api/auth',
}));

app.use(createProxyMiddleware({
  target: 'http://catalog-service:5001',
  changeOrigin: true,
  pathFilter: '/api/books',
}));

app.use(createProxyMiddleware({
  target: 'http://circulation-service:5003',
  changeOrigin: true,
  pathFilter: ['/api/loans', '/api/penalties', '/api/settings'],
}));

app.use(createProxyMiddleware({
  target: 'http://notification-service:5004',
  changeOrigin: true,
  pathFilter: ['/api/notifications', '/api/reports'],
}));

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', service: 'API Gateway' });
});

app.listen(PORT, () => {
  console.log(`[API Gateway] Server đang chạy tại http://localhost:${PORT}`);
});
