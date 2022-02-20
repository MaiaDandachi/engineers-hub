import express from 'express';
import {
  getPosts,
  createPost,
  getPostById,
  updatePost,
  deletePost,
  likePost,
  unlikePost,
} from '../controllers/postController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/').get(getPosts).post(protect, createPost);

router.route('/:id').get(getPostById).put(protect, updatePost).delete(protect, deletePost);

router.route('/:id/like').get(likePost);

router.route('/:id/unlike').get(protect, unlikePost);

export default router;
