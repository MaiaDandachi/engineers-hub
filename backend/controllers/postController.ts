import asyncHandler from 'express-async-handler';
import { Request, Response } from 'express';

import { Post } from '../entities/Post';
import { User } from '../entities/User';

//@desc Get all posts
//@route GET /api/posts
//@access public
const getPosts = asyncHandler(async (req: Request, res: Response) => {
  const posts = await Post.find({ relations: ['user', 'comments', 'likes'] });

  const responsePosts = posts.map((post) => ({
    ...post,
    comment_count: post.comments.length,
    like_count: post.likes.length,
  }));

  res.json({ posts: responsePosts });
});

//@desc Create a post
//@route POST /api/posts
//@access private
const createPost = asyncHandler(async (req: Request, res: Response) => {
  const { title, content } = req.body;

  const postHasSameTitle = await Post.findOne({ title }, { relations: ['user'] });

  const user = await User.findOne(req.currentUser.id);

  if (!user) {
    throw new Error("User doesn't exist");
  }

  if (postHasSameTitle?.user.id === user.id) {
    throw new Error('You have written a post with same title before!');
  }

  const newPost = Post.create({
    title,
    content,
    user,
  });

  await newPost.save();

  res.status(201).json({ post: newPost });
});

//@desc Get a post by id
//@route GET /api/posts/:id
//@access private
const getPostById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const post = await Post.findOne({ id }, { relations: ['user'] });

  if (!post) {
    res.status(404).json({ message: 'Post not found!' });
  } else {
    res.json({ post });
  }
});

//@desc Edit a post
//@route PUT /api/posts/:id
//@access private
const updatePost = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, content } = req.body;

  const post = await Post.findOne({ id }, { relations: ['user'] });

  if (post) {
    if (req.currentUser?.id !== post.user.id) {
      res.status(401);
      throw new Error('Not authorized to edit the post!');
    } else {
      post.title = title;
      post.content = content;
    }

    const updatedPost = await post.save();

    res.json({ post: updatedPost });
  } else {
    res.status(404);
    throw new Error('Post not found');
  }
});

//@desc Remove a post
//@route DELETE /api/posts/:id
//@access private
const deletePost = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const post = await Post.findOne({ id }, { relations: ['user'] });

  if (post) {
    if (req.currentUser?.id !== post.user.id) {
      res.status(401);
      throw new Error('Not authorized to delete the post!');
    } else {
      await post.remove();
      res.json({ message: 'Post removed', postId: id });
    }
  } else {
    res.status(404);
    throw new Error('Post not found');
  }
});

export { getPosts, createPost, getPostById, updatePost, deletePost };
