import express from 'express';
import { protect } from './../middleware/protectRoute.js';
import {
  deleteNotifications,
  deleteSingleNotifications,
  getNotifications,
} from '../controllers/notificationCtrl.js';

const router = express.Router();

router.get('/', protect, getNotifications);
router.delete('/', protect, deleteNotifications);
router.delete('/:id', protect, deleteSingleNotifications);

export default router;
