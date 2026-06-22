import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { seedAdmin } from './services/authService.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5002;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', service: 'Auth Service' });
});

const startServer = async () => {
  await connectDB();
  await seedAdmin(); // Đảm bảo luôn có 1 admin

  app.listen(PORT, () => {
    console.log(`[Auth Service] Server đang chạy tại http://localhost:${PORT}`);
  });
};

startServer();
