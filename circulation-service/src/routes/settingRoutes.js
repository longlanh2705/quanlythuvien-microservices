import express from 'express';
import * as settingController from '../controllers/settingController.js';

const router = express.Router();

router.get('/', settingController.getAllSettings);
router.put('/:key', settingController.updateSetting);

export default router;
