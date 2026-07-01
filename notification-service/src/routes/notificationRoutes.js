import express from 'express';
import * as notificationController from '../controllers/notificationController.js';

const router = express.Router();

router.get('/', notificationController.getUserNotifications);
router.post('/', notificationController.createNotification);
router.put('/:id/read', notificationController.markAsRead);

export default router;
