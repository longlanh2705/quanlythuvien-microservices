import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import notificationRoutes from './routes/notificationRoutes.js';
import reportRoutes from './routes/reportRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5004;

app.use(cors());
app.use(express.json());

// Kết nối Database
connectDB();

app.use('/api/notifications', notificationRoutes);
app.use('/api/reports', reportRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', service: 'Notification & Reporting Service' });
});

app.listen(PORT, () => {
  console.log(`[Notification Service] Server đang chạy tại cổng http://localhost:${PORT}`);
});
