import asyncHandler from 'express-async-handler';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator';

import { User } from '../entities/User';
import { Like } from '../entities/Like';
import generateToken from '../utils/generateToken';

//@desc Register A User
//@route POST /api/users/register
//@access public
const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error('Invalid inputs passed, please check your data');
  }
  const { name, email, password } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(401);
    throw new Error('User already exists');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // construct the user obj
  const newUser = User.create({
    name,
    email,
    password: hashedPassword,
  });

  await newUser.save();

  res.status(201).json({
    id: newUser.id,
    email: newUser.email,
    name: newUser.name,
    token: generateToken(newUser.id),
  });
});

//@desc Login A User
//@route POST /api/users/login
//@access public
const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error('Invalid inputs passed, please check your data');
  }
  const { email, password } = req.body;
  const registeredUser = await User.findOne({ email });

  if (registeredUser) {
    const passwordMatch = await bcrypt.compare(password, registeredUser.password);

    if (passwordMatch) {
      res.json({
        id: registeredUser.id,
        name: registeredUser.name,
        email: registeredUser.email,
        token: generateToken(registeredUser.id),
      });
    } else {
      res.status(401);
      throw new Error('Invalid password');
    }
  } else {
    res.status(401);
    throw new Error('Invalid email, please register.');
  }
});

//@desc Get all users
//@route GET /api/users
//@access public
const getUsers = asyncHandler(async (req: Request, res: Response) => {
  const users = await User.find({});

  res.json({ users });
});

//@desc Get user's liked posts
//@route GET /api/users/:id/likedPosts
//@access private
const getUserLikedPosts = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const user = await User.findOne({ id });

  if (user) {
    if (user.id === req.currentUser?.id) {
      const likedPosts = await Like.createQueryBuilder('like')
        .leftJoin('like.user', 'user')
        .leftJoinAndSelect('like.post', 'post')
        .where('user.id = :id', { id })
        .getMany();
      // .addSelect('post.id')

      const likedPostIds = likedPosts.map((likeObj) => likeObj.post.id);
      res.send({ userLikedPosts: likedPostIds });
    } else {
      res.status(401);
      throw new Error('logged in user have no access to the liked posts');
    }
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

export { registerUser, loginUser, getUsers, getUserLikedPosts };
