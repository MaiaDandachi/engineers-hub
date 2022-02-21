import express from 'express';
import { check } from 'express-validator';
import { registerUser, loginUser, getUsers, getUserLikedPosts } from '../controllers/userController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();
router.route('/').get(getUsers);

router
  .route('/register')
  .post(
    [
      check('name').not().isEmpty(),
      check('email').normalizeEmail().isEmail(),
      check('password').isString().isLength({ min: 8 }),
    ],
    registerUser
  );

router.route('/login').post(loginUser);
router.route('/:id/likedPosts').get(protect, getUserLikedPosts);

export default router;
