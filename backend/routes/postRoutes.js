import express from 'express';
import { protect } from '../middleware/protectRoute.js';
import {
  commentOnPost,
  createPost,
  deletePost,
  getAllPosts,
  getFollowingPosts,
  getLikedPosts,
  getUserPosts,
  likeUnlikePost,
} from '../controllers/postCtrl.js';

const router = express.Router();

router.get('/', protect, getAllPosts);
router.get('/following', protect, getFollowingPosts);
router.get('/likes/:id', protect, getLikedPosts);
router.get('/user/:username', protect, getUserPosts);
router.post('/create', protect, createPost);
router.post('/like/:id', protect, likeUnlikePost);
router.post('/comment/:id', protect, commentOnPost);
router.delete('/:id', protect, deletePost);

export default router;
