import express from 'express';
import { getMe, login, logout, register } from '../controllers/authCtrl.js';
import { protect } from '../middleware/protectRoute.js';
const router = express.Router();

router.get('/me', protect, getMe);
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

export default router;
