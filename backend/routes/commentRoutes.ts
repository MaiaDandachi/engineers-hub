import express from 'express';
import { createComment, deleteCommentonPost } from '../controllers/commentController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/').post(protect, createComment);
router.route('/:id').delete(protect, deleteCommentonPost);

export default router;
