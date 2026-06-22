import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { connectRabbitMQ } from './services/rabbitmqService.js';
import bookRoutes from './routes/bookRoutes.js';

// Load biến môi trường
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/books', bookRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    service: 'Catalog Service',
    timestamp: new Date(),
  });
});

// Route mặc định cho root
app.get('/', (req, res) => {
  res.send('Chào mừng bạn đến với Catalog Service - Hệ thống quản lý thư viện microservices');
});

// Hàm khởi động Server
const startServer = async () => {
  // 1. Kết nối MongoDB
  await connectDB();
  
  // 2. Kết nối RabbitMQ (bất đồng bộ để không chặn khởi động server nếu RabbitMQ chưa sẵn sàng)
  connectRabbitMQ();

  // 3. Lắng nghe Port
  app.listen(PORT, () => {
    console.log(`[Catalog Service] Server đang chạy tại cổng http://localhost:${PORT}`);
  });
};

startServer();
