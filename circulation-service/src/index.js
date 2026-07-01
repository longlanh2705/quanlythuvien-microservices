import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import loanRoutes from './routes/loanRoutes.js';
import penaltyRoutes from './routes/penaltyRoutes.js';
import settingRoutes from './routes/settingRoutes.js';
import { initDefaultSettings } from './controllers/settingController.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5003;

app.use(cors());
app.use(express.json());

// Kết nối Database
connectDB().then(() => {
  initDefaultSettings();
});

app.use('/api/loans', loanRoutes);
app.use('/api/penalties', penaltyRoutes);
app.use('/api/settings', settingRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', service: 'Circulation Service' });
});

app.listen(PORT, () => {
  console.log(`[Circulation Service] Server đang chạy tại cổng http://localhost:${PORT}`);
});
