import express from 'express';
import { protect } from '../middleware/protectRoute.js';
import {
  followUnfollowUser,
  getSuggestedUsers,
  getUserProfile,
  updateUser,
} from '../controllers/userCtrl.js';

const router = express.Router();

router.get('/profile/:username', protect, getUserProfile);
router.get('/suggested', protect, getSuggestedUsers);
router.post('/follow/:id', protect, followUnfollowUser);
router.post('/update', protect, updateUser);

export default router;
