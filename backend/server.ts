import express from 'express';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcrypt';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import SocketServer from './socketServer';
import { IUser, IPost, ILikeObj, IComment } from './interfaces';
import { connectDB } from './config/db';
import userRoutes from './routes/userRoutes';
import postRoutes from './routes/postRoutes';
import commentRoutes from './routes/commentRoutes';

dotenv.config();

const app = express();
const httpServer = createServer(app);
app.use(express.json());

connectDB();

app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);

//-----------------------------------------
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
  },
});

io.on('connection', (socket) => {
  SocketServer(socket);
});

// const DATA_FILE = path.join(__dirname, 'data/users.json');
// const POSTS_DATA_FILE = path.join(__dirname, 'data/posts.json');
// const COMMENTS_DATA_FILE = path.join(__dirname, 'data/comments.json');
// const LIKES_DATA_FILE = path.join(__dirname, 'data/likes.json');

// app.get('/', (req, res) => {
//   res.send('API IS RUNNING...');
// });

// app.get('/api/users', (req, res) => {
//   const data = fs.readFileSync(DATA_FILE);
//   res.json(JSON.parse(data.toString()));
// });

// app.post('/api/users/register', async (req, res) => {
//   const users = JSON.parse(fs.readFileSync(DATA_FILE).toString());
//   try {
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(req.body.password, salt);

//     const newUser: IUser = {
//       id: req.body.id,
//       userName: req.body.userName,
//       email: req.body.email,
//       password: hashedPassword,
//     };

//     const alreadyRegisteredUser = users.some((user: IUser) => user.email === newUser.email);

//     if (!alreadyRegisteredUser) {
//       users.push(newUser);
//       fs.writeFileSync(DATA_FILE, JSON.stringify(users));

//       const userResponse: Partial<IUser> = { ...newUser };
//       delete userResponse.password;

//       res.status(201).json({ user: userResponse });
//     } else {
//       res.status(401);
//       throw new Error('User already exists');
//     }
//   } catch (err) {
//     throw new Error('Could not hash the user password');
//   }
// });

// app.post('/api/users/login', (req, res, next) => {
//   const { email, password } = req.body;
//   const users = JSON.parse(fs.readFileSync(DATA_FILE).toString());

//   const registeredUser = users.find((user: IUser) => user.email === email);

//   if (registeredUser) {
//     bcrypt
//       .compare(password, registeredUser.password)
//       .then((isMatch) => {
//         let isPasswordInvalid = false;

//         if (isMatch) {
//           delete registeredUser.password;
//           res.json({ user: registeredUser });
//         } else {
//           isPasswordInvalid = true;
//         }

//         // if the compare between the 2 passwords was not match
//         if (isPasswordInvalid) {
//           res.status(401);
//           throw new Error('Invalid password');
//         }
//       })
//       .catch((err) => {
//         // let the custom error middleware handle it.
//         next(err);
//       });
//   } else {
//     // if the user is not registered with the given email.
//     res.status(401);
//     throw new Error('Invalid email');
//   }
// });
//-------------------------------------------------------
// app.get('/api/posts', (req, res) => {
//   const data = fs.readFileSync(POSTS_DATA_FILE);
//   // using setTimeout so that the loader appears before loading data, like mocking a database.
//   setTimeout(() => {
//     res.json({ posts: JSON.parse(data.toString()) });
//   }, 3000);
// });

// app.post('/api/posts', (req, res) => {
//   const { id, postUserInfo, title, content } = req.body;
//   const posts = JSON.parse(fs.readFileSync(POSTS_DATA_FILE).toString());

//   const newPost = {
//     id,
//     postUserInfo,
//     title,
//     content,
//     commentsCount: 0,
//     likesCount: 0,
//   };

//   const isNewPostAlreadyWritten = posts.some(
//     (post: IPost) => post.postUserInfo.id === newPost.postUserInfo.id && post.title === title
//   );

//   if (isNewPostAlreadyWritten) {
//     res.status(400);
//     throw new Error('Post already exists');
//   }

//   posts.push(newPost);
//   fs.writeFileSync(POSTS_DATA_FILE, JSON.stringify(posts));

//   // const responsePost = { ...newPost };
//   // delete responsePost.postUserInfo;

//   res.status(201).json({ post: newPost });
// });

// app.put('/api/posts/:id', (req, res) => {
//   const { postUserInfo, title, content } = req.body;
//   const posts = JSON.parse(fs.readFileSync(POSTS_DATA_FILE).toString());

//   const foundPostIndex = posts.findIndex((post: IPost) => post.id === req.params.id);

//   if (foundPostIndex !== -1) {
//     if (posts[foundPostIndex].postUserInfo.id !== postUserInfo.id) {
//       res.status(401);
//       throw new Error('logged in user is not the post owner.');
//     }
//     const updatedPost = { ...posts[foundPostIndex], title, content };
//     posts[foundPostIndex] = updatedPost;
//     fs.writeFileSync(POSTS_DATA_FILE, JSON.stringify(posts));

//     // delete updatedPost.postUserInfo;

//     res.json({ post: updatedPost });
//   } else {
//     res.status(404);
//     throw new Error('Post not found');
//   }
// });

// app.get('/api/posts/:id', (req, res) => {
//   const posts = JSON.parse(fs.readFileSync(POSTS_DATA_FILE).toString());

//   const foundPost = posts.find((post: IPost) => post.id === req.params.id);

//   if (foundPost) {
//     res.json(foundPost);
//   } else {
//     res.status(404).json({ errorMessage: 'Post not found!' });
//   }
// });

// app.delete('/api/posts/:id', (req, res) => {
//   const posts = JSON.parse(fs.readFileSync(POSTS_DATA_FILE).toString());

//   const filteredPosts = posts.filter((post: IPost) => post.id !== req.params.id);

//   fs.writeFileSync(POSTS_DATA_FILE, JSON.stringify(filteredPosts));
//   res.json({ message: 'Post removed', postId: req.params.id });
// });

// -----------------------------------------------
// app.get('/api/posts/:postId/comments', (req, res) => {
//   const comments = JSON.parse(fs.readFileSync(COMMENTS_DATA_FILE).toString());
//   const users = JSON.parse(fs.readFileSync(DATA_FILE).toString());

//   const filteredComments = comments.filter((comment: IComment) => comment.postId === req.params.postId);

//   // populate userInfo for the comments
//   const userPopulatedComments = filteredComments.map((comment: IComment) => {
//     const commentUser = users.find((user: IUser) => user.id === comment.userId);
//     return {
//       ...comment,
//       userInfo: {
//         ...commentUser,
//       },
//     };
//   });

//   // using setTimeout so that the loader appears before loading data, like mocking a database.
//   setTimeout(() => {
//     res.json({ comments: userPopulatedComments });
//   }, 2000);
// });

// app.post('/api/posts/:postId/comments', (req, res) => {
//   const { id, text, creationDate, userId } = req.body;
//   const comments = JSON.parse(fs.readFileSync(COMMENTS_DATA_FILE).toString());

//   const { postId } = req.params;

//   const newComment = {
//     id,
//     postId,
//     text,
//     creationDate,
//     userId,
//   };

//   const isNewCommentAlreadyWritten = comments.some(
//     (comment: IComment) => comment.userId === newComment.userId && comment.text === newComment.text
//   );

//   const isCommentWritteOnSamePost = comments.some((comment: IComment) => comment.postId === newComment.postId);

//   if (isNewCommentAlreadyWritten && isCommentWritteOnSamePost) {
//     res.status(400);
//     throw new Error('You have already commented on the post');
//   }

//   comments.push(newComment);
//   fs.writeFileSync(COMMENTS_DATA_FILE, JSON.stringify(comments));

//   // When adding a comment increase comment count
//   const posts = JSON.parse(fs.readFileSync(POSTS_DATA_FILE).toString());

//   const commentedOnPostId = posts.findIndex((post: IPost) => post.id === postId);

//   const updatedPost = {
//     ...posts[commentedOnPostId],
//     commentsCount: posts[commentedOnPostId].commentsCount + 1,
//   };

//   posts[commentedOnPostId] = updatedPost;

//   fs.writeFileSync(POSTS_DATA_FILE, JSON.stringify(posts));

//   res.status(201).json({ comment: newComment });
// });

// app.delete('/api/posts/:postId/comments/:id', (req, res) => {
//   const comments = JSON.parse(fs.readFileSync(COMMENTS_DATA_FILE).toString());

//   const filteredComments = comments.filter((comment: IComment) => comment.id !== req.params.id);

//   fs.writeFileSync(COMMENTS_DATA_FILE, JSON.stringify(filteredComments));
//   res.json({ message: 'Comment removed', commentId: req.params.id });
// });

// ----------------------------------------------
// app.post('/api/posts/:postId/like', (req, res) => {
//   const posts = JSON.parse(fs.readFileSync(POSTS_DATA_FILE).toString());
//   const likes = JSON.parse(fs.readFileSync(LIKES_DATA_FILE).toString());

//   const { userId } = req.body;
//   const isPostLikedByUser = likes.some(
//     (likeObj: ILikeObj) => likeObj.userId === userId && likeObj.postId === req.params.postId
//   );

//   if (!isPostLikedByUser) {
//     // if the user didn't like the post, add userId & postId to likes and increment likesCount inside that post
//     likes.push({
//       userId,
//       postId: req.params.postId,
//     });

//     fs.writeFileSync(LIKES_DATA_FILE, JSON.stringify(likes));

//     const likedPostId = posts.findIndex((post: IPost) => post.id === req.params.postId);

//     const updatedPost = {
//       ...posts[likedPostId],
//       likesCount: posts[likedPostId].likesCount + 1,
//     };

//     posts[likedPostId] = updatedPost;
//     fs.writeFileSync(POSTS_DATA_FILE, JSON.stringify(posts));

//     return res.status(201).json({ post: posts[likedPostId] });
//   }

//   res.status(401);
//   throw new Error('Post is already liked');
// });

// app.post('/api/posts/:postId/unlike', (req, res) => {
//   const posts = JSON.parse(fs.readFileSync(POSTS_DATA_FILE).toString());
//   const likes = JSON.parse(fs.readFileSync(LIKES_DATA_FILE).toString());

//   const { userId } = req.body;
//   const isPostLikedByUser = likes.some(
//     (likeObj: ILikeObj) => likeObj.userId === userId && likeObj.postId === req.params.postId
//   );

//   if (!isPostLikedByUser) {
//     return res.status(400).json({ errorMessage: 'Post is not liked' });
//   }
//   // if the like exists remove the like from LIKES_DATA_FILE
//   const filteredLikesObjs = likes.filter(
//     (likeObj: ILikeObj) => likeObj.postId !== req.params.postId && likeObj.userId !== req.body.userId
//   );

//   fs.writeFileSync(LIKES_DATA_FILE, JSON.stringify(filteredLikesObjs));

//   // decrement likesCount inside that post
//   const unlikedPostId = posts.findIndex((post: IPost) => post.id === req.params.postId);

//   const updatedPost = {
//     ...posts[unlikedPostId],
//     likesCount: posts[unlikedPostId].likesCount - 1,
//   };

//   posts[unlikedPostId] = updatedPost;
//   fs.writeFileSync(POSTS_DATA_FILE, JSON.stringify(posts));

//   return res.status(201).json({ post: posts[unlikedPostId] });
// });

// app.get('/api/users/:userId/likedPosts', (req, res) => {
//   const likes = JSON.parse(fs.readFileSync(LIKES_DATA_FILE).toString());

//   const filteredLikes = likes.filter((likeObj: ILikeObj) => likeObj.userId === req.params.userId);

//   const userLikedPostsIds = filteredLikes.map((likeObj: ILikeObj) => likeObj.postId);
//   return res.json({
//     userLikedPosts: userLikedPostsIds,
//   });
// });

// ----------------------------------------------
const notFound = (req: any, res: any, next: any) => {
  console.log('NOT FOUND ERROR');
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err: any, req: any, res: any, next: any) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    errorMessage: err.message,
  });
};

app.use(notFound);
app.use(errorHandler);

httpServer.listen(5000, () => console.log('SERVER IS RUNNING ON PORT 5000'));
