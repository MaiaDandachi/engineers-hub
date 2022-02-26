import asyncHandler from 'express-async-handler';
import { Request, Response } from 'express';

import { Post } from '../entities/Post';
import { User } from '../entities/User';
import { Like } from '../entities/Like';
import { Comment } from '../entities/Comment';

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

//@desc Like a post
//@route GET /api/posts/:id/like
//@access private
const likePost = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const user = (await User.findOne(req.currentUser?.id)) as User;

  const postToBeLiked = await Post.findOne({ id }, { relations: ['user'] });

  if (!postToBeLiked) {
    res.status(404).send({ message: 'Post does not exist.' });
    return;
  }

  const isPostLikedByUser = await Like.findOne({ user, post: postToBeLiked });

  if (isPostLikedByUser && Object.keys(isPostLikedByUser).length > 0) {
    res.status(400).send({ message: 'You already liked this post' });
    return;
  }

  // add a like to the Like table with userId and postId reference.
  const like = new Like();
  like.user = user;
  like.post = postToBeLiked;
  await like.save();

  res.send({ post: postToBeLiked });
});

//@desc Unlike a post
//@route GET /api/posts/:id/unlike
//@access private
const unlikePost = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const user = (await User.findOne(req.currentUser?.id)) as User;

  const unlikedPost = await Post.findOne({ id }, { relations: ['user'] });

  if (!unlikedPost) {
    res.status(404).send({ message: 'Post does not exist.' });
    return;
  }

  const isPostLikedByUser = await Like.findOne({ user, post: unlikedPost });

  if (isPostLikedByUser && Object.keys(isPostLikedByUser).length > 0) {
    // remove the like from Like table.
    await Like.delete({ user, post: unlikedPost });

    res.send({ post: unlikedPost });
    return;
  }

  res.status(400).send({ message: 'Post is not liked' });
});

//@desc Get all comments for a post
//@route GET /api/posts/:id/comments
//@access private
const getComments = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const post = await Post.findOne({ id });

  if (!post) {
    res.status(404).send({ message: 'Post does not exist' });
    return;
  }

  const comments = await Comment.createQueryBuilder('comment')
    .leftJoinAndSelect('comment.post', 'post')
    .where('post.id = :id', { id })
    .leftJoinAndSelect('comment.user', 'user')
    .getMany();

  res.json({ comments });
});

export { getPosts, createPost, getPostById, updatePost, deletePost, likePost, unlikePost, getComments };
