const express = require('express');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');

const app = express();
app.use(express.json());

const DATA_FILE = path.join(__dirname, 'data/users.json');
const POSTS_DATA_FILE = path.join(__dirname, 'data/posts.json');
const COMMENTS_DATA_FILE = path.join(__dirname, 'data/comments.json');

app.get('/', (req, res) => {
  res.send('API IS RUNNING...');
});

app.get('/api/users', (req, res) => {
  const data = fs.readFileSync(DATA_FILE);
  res.json(JSON.parse(data));
});

app.post('/api/users/register', async (req, res) => {
  const users = JSON.parse(fs.readFileSync(DATA_FILE));
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const newUser = {
      id: req.body.id,
      userName: req.body.userName,
      email: req.body.email,
      password: hashedPassword,
    };

    const alreadyRegisteredUser = users.some((user) => user.email === newUser.email);

    if (!alreadyRegisteredUser) {
      users.push(newUser);
      fs.writeFileSync(DATA_FILE, JSON.stringify(users));

      const userResponse = { ...newUser };
      delete userResponse.password;

      res.status(201).json({ user: userResponse });
    } else {
      res.status(401);
      throw new Error('User already exists');
    }
  } catch (err) {
    throw new Error('Could not hash the user password');
  }
});

app.post('/api/users/login', async (req, res) => {
  const users = JSON.parse(fs.readFileSync(DATA_FILE));
  try {
    const requestedUser = {
      email: req.body.email,
      password: req.body.password,
    };

    const loggedUser = users.find((user) => user.email === requestedUser.email);

    const doesPasswordsMatch = await bcrypt.compare(requestedUser.password, loggedUser.password);

    if (loggedUser && doesPasswordsMatch) {
      const userResponse = { ...loggedUser };
      delete userResponse.password;

      res.status(201).json({ user: userResponse });
    } else {
      res.status(401);
      throw new Error('Invalid email or password');
    }
  } catch (err) {
    throw new Error('Could not hash the user password');
  }
});
//-------------------------------------------------------
app.get('/api/posts', (req, res) => {
  const data = fs.readFileSync(POSTS_DATA_FILE);
  // using setTimeout so that the loader appears before loading data, like mocking a database.
  setTimeout(() => {
    res.json({ posts: JSON.parse(data) });
  }, 3000);
});

app.post('/api/posts', (req, res) => {
  const { id, postUserInfo, title, content } = req.body;
  const posts = JSON.parse(fs.readFileSync(POSTS_DATA_FILE));

  const newPost = {
    id,
    postUserInfo,
    title,
    content,
  };

  const isNewPostAlreadyWritten = posts.some(
    (post) => post.postUserInfo.id === newPost.postUserInfo.id && post.title === title
  );

  if (isNewPostAlreadyWritten) {
    res.status(400);
    throw new Error('Post already exists');
  }

  posts.push(newPost);
  fs.writeFileSync(POSTS_DATA_FILE, JSON.stringify(posts));

  // const responsePost = { ...newPost };
  // delete responsePost.postUserInfo;

  res.status(201).json({ post: newPost });
});

app.put('/api/posts/:id', (req, res) => {
  const { postUserInfo, title, content } = req.body;
  const posts = JSON.parse(fs.readFileSync(POSTS_DATA_FILE));

  const foundPostIndex = posts.findIndex((post) => post.id === req.params.id);

  if (foundPostIndex !== -1) {
    if (posts[foundPostIndex].postUserInfo.id !== postUserInfo.id) {
      res.status(401);
      throw new Error('logged in user is not the post owner.');
    }
    const updatedPost = { ...posts[foundPostIndex], title, content };
    posts[foundPostIndex] = updatedPost;
    fs.writeFileSync(POSTS_DATA_FILE, JSON.stringify(posts));

    // delete updatedPost.postUserInfo;

    res.json({ post: updatedPost });
  } else {
    res.status(404);
    throw new Error('Post not found');
  }
});

app.get('/api/posts/:id', (req, res) => {
  const posts = JSON.parse(fs.readFileSync(POSTS_DATA_FILE));

  const foundPost = posts.find((post) => post.id === req.params.id);

  if (foundPost) {
    res.json(foundPost);
  } else {
    res.status(404).json({ errorMessage: 'Post not found!' });
  }
});

app.delete('/api/posts/:id', (req, res) => {
  const posts = JSON.parse(fs.readFileSync(POSTS_DATA_FILE));

  const filteredPosts = posts.filter((post) => post.id !== req.params.id);

  fs.writeFileSync(POSTS_DATA_FILE, JSON.stringify(filteredPosts));
  res.json({ message: 'Post removed', postId: req.params.id });
});

// -----------------------------------------------
app.get('/api/posts/:postId/comments', (req, res) => {
  const comments = JSON.parse(fs.readFileSync(COMMENTS_DATA_FILE));
  const users = JSON.parse(fs.readFileSync(DATA_FILE));

  const filteredComments = comments.filter((comment) => comment.postId === req.params.postId);

  // populate userInfo for the comments
  const userPopulatedComments = filteredComments.map((comment) => {
    const commentUser = users.find((user) => user.id === comment.userId);
    return {
      ...comment,
      userInfo: {
        ...commentUser,
      },
    };
  });

  // using setTimeout so that the loader appears before loading data, like mocking a database.
  setTimeout(() => {
    res.json({ comments: userPopulatedComments });
  }, 2000);
});

app.post('/api/posts/:postId/comments', (req, res) => {
  const { id, text, creationDate, userId } = req.body;
  const comments = JSON.parse(fs.readFileSync(COMMENTS_DATA_FILE));

  const { postId } = req.params;

  const newComment = {
    id,
    postId,
    text,
    creationDate,
    userId,
  };

  const isNewCommentAlreadyWritten = comments.some(
    (comment) => comment.userId === newComment.userId && comment.text === newComment.text
  );

  const isCommentWritteOnSamePost = comments.some((comment) => comment.postId === newComment.postId);

  if (isNewCommentAlreadyWritten && isCommentWritteOnSamePost) {
    res.status(400);
    throw new Error('You have already commented on the post');
  }

  comments.push(newComment);
  fs.writeFileSync(COMMENTS_DATA_FILE, JSON.stringify(comments));

  // When adding a comment increase comment count
  const posts = JSON.parse(fs.readFileSync(POSTS_DATA_FILE));

  const commentedOnPostId = posts.findIndex((post) => post.id === postId);

  const updatedPost = {
    ...posts[commentedOnPostId],
    commentsCount: posts[commentedOnPostId].commentsCount ? posts[commentedOnPostId].commentsCount + 1 : 1,
  };

  posts[commentedOnPostId] = updatedPost;

  fs.writeFileSync(POSTS_DATA_FILE, JSON.stringify(posts));

  res.status(201).json({ comment: newComment });
});

app.delete('/api/posts/:postId/comments/:id', (req, res) => {
  const comments = JSON.parse(fs.readFileSync(COMMENTS_DATA_FILE));

  const filteredComments = comments.filter((comment) => comment.id !== req.params.id);

  fs.writeFileSync(COMMENTS_DATA_FILE, JSON.stringify(filteredComments));
  res.json({ message: 'Comment removed', commentId: req.params.id });
});

// ----------------------------------------------
const notFound = (req, res, next) => {
  console.log('NOT FOUND ERROR');
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    errorMessage: err.message,
  });
};

app.use(notFound);
app.use(errorHandler);

app.listen(5000, () => console.log('SERVER IS RUNNING ON PORT 5000'));
