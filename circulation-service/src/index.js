import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import circulationRoutes from './routes/circulationRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5003;

app.use(cors());
app.use(express.json());

app.use('/api/circulation', circulationRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', service: 'Circulation Service' });
});

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`[Circulation Service] Server đang chạy tại http://localhost:${PORT}`);
  });
};

startServer();
