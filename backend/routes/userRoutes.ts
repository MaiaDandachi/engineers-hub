import express from 'express';
import { check } from 'express-validator';
import { registerUser, loginUser, getUsers } from '../controllers/userController';
import { protect } from '../middleware/authMiddleware.js';

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

export default router;
