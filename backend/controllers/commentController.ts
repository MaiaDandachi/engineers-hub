import asyncHandler from 'express-async-handler';
import { Request, Response } from 'express';

import { Comment } from '../entities/Comment';
import { User } from '../entities/User';
import { Post } from '../entities/Post';

//@desc Comment on a post
//@route POST /api/comments
//@access private
const createComment = asyncHandler(async (req: Request, res: Response) => {
  const { text, postId } = req.body;

  const user = (await User.findOne({
    id: req.currentUser?.id,
  })) as User;

  const post = (await Post.findOne({
    id: postId,
  })) as Post;

  const isCommentWrittenByUserForPost = await User.createQueryBuilder('user')
    .leftJoin('user.posts', 'post')
    .where('user.id = :id', { id: req.currentUser?.id })
    .leftJoinAndSelect('post.comments', 'comment')
    .where('post.id = :id', { id: postId })
    .getMany();

  if (isCommentWrittenByUserForPost && Object.keys(isCommentWrittenByUserForPost).length > 0) {
    res.status(400);
    throw new Error('You commented same comment on this post before.');
  }

  const comment = new Comment();
  comment.user = user;
  comment.post = post;
  comment.text = text;
  await comment.save();

  res.json({ comment });
});

//@desc Delete a comment
//@route DELEte /api/comments/:id
//@access private
const deleteCommentonPost = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { postId } = req.body;

  const user = (await User.findOne({
    id: req.currentUser?.id,
  })) as User;

  const post = (await Post.findOne({
    id: postId,
  })) as Post;

  if (!post) {
    res.status(404).send({ message: 'Post does not exist' });
    return;
  }

  const comment = await Comment.findOne(
    {
      id,
      user,
      post,
    },
    {
      relations: ['post'],
    }
  );

  if (comment && Object.keys(comment).length > 0) {
    await Comment.delete({ id, user, post });

    res.send({
      message: 'Comment has been removed.',
      comment,
    });
    return;
  }

  res.status(404).send({
    message: 'Comment does not exist on the post.',
  });
});

export { createComment, deleteCommentonPost };
