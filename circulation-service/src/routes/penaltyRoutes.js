import express from 'express';
import * as penaltyController from '../controllers/penaltyController.js';

const router = express.Router();

router.get('/', penaltyController.getAllPenalties);
router.put('/:id/pay', penaltyController.payPenalty);

export default router;
