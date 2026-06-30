import express from 'express';
import * as circulationController from '../controllers/circulationController.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

// GET /api/circulation/history?page=1&limit=10
router.get('/history', verifyToken, circulationController.getHistory);

// GET /api/circulation/stats (tổng số mượn/trả/quá hạn)
router.get('/stats', verifyToken, circulationController.getStats);

export default router;
