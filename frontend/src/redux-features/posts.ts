/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';

interface User {
  id: string;
  userName: string;
}

interface Post {
  id: string;
  title: string;
  content: string;
  postUserInfo: User;
  commentsCount: number;
  likesCount: number;
}

interface PostsState {
  error: string | null | undefined;
  posts: Array<Post> | [];
  isLoading: boolean | undefined;
}
const initialState: PostsState = {
  posts: [],
  error: null,
  isLoading: false,
};

interface ValidationErrors {
  errorMessage: string;
}

export const getPosts = createAsyncThunk<
  // Return type of the payload creator
  Array<Post>,
  undefined,
  {
    // Optional fields for defining thunkApi field types
    rejectValue: ValidationErrors;
  }
>('posts/getPosts', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get<{ posts: Array<Post> }>('/api/posts');

    return response.data.posts;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    const error: AxiosError<ValidationErrors> = err;
    if (!error.response) {
      throw err;
    }
    return rejectWithValue(error.response.data);
  }
});

export const createPost = createAsyncThunk<
  // Return type of the payload creator
  Post,
  // postData object type
  Partial<Post>,
  {
    // Optional fields for defining thunkApi field types
    rejectValue: ValidationErrors;
  }
>('posts/createPost', async (postData, { rejectWithValue }) => {
  try {
    const { id, title, content, postUserInfo } = postData;
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const response = await axios.post<{
      post: Post;
    }>(
      '/api/posts',
      {
        id,
        title,
        content,
        postUserInfo,
        commentsCount: 0,
        likesCount: 0,
      },
      config
    );

    return response.data.post;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    const error: AxiosError<ValidationErrors> = err;
    if (!error.response) {
      throw err;
    }
    return rejectWithValue(error.response.data);
  }
});

export const editPost = createAsyncThunk<
  // Return type of the payload creator
  Post,
  // postData object type
  { id: string; title: string; content: string; postUserInfo: User },
  {
    // Optional fields for defining thunkApi field types
    rejectValue: ValidationErrors;
  }
>('posts/editPost', async (postData, { rejectWithValue }) => {
  try {
    const { id, title, content, postUserInfo } = postData;
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const response = await axios.put<{
      post: Post;
    }>(
      `/api/posts/${id}`,
      {
        title,
        content,
        postUserInfo,
      },
      config
    );

    return response.data.post;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    const error: AxiosError<ValidationErrors> = err;
    if (!error.response) {
      throw err;
    }
    return rejectWithValue(error.response.data);
  }
});

export const deletePost = createAsyncThunk<
  // Return type of the payload creator
  { message: string; postId: string },
  // postData object type
  string,
  {
    // Optional fields for defining thunkApi field types
    rejectValue: ValidationErrors;
  }
>('posts/deletePost', async (postId, { rejectWithValue }) => {
  try {
    const response = await axios.delete(`/api/posts/${postId}`);

    return response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    const error: AxiosError<ValidationErrors> = err;
    if (!error.response) {
      throw err;
    }
    return rejectWithValue(error.response.data);
  }
});

export const likePost = createAsyncThunk<
  // Return type of the payload creator
  Post,
  { postId: string; userId: string },
  {
    // Optional fields for defining thunkApi field types
    rejectValue: ValidationErrors;
  }
>('posts/likePost', async ({ postId, userId }, { rejectWithValue }) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const response = await axios.post<{ post: Post }>(`/api/posts/${postId}/like`, { userId }, config);

    return response.data.post;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    const error: AxiosError<ValidationErrors> = err;
    if (!error.response) {
      throw err;
    }
    return rejectWithValue(error.response.data);
  }
});

export const unlikePost = createAsyncThunk<
  Post,
  // action function parameter object type
  { postId: string; userId: string },
  {
    // Optional fields for defining thunkApi field types
    rejectValue: ValidationErrors;
  }
>('posts/unlikePost', async ({ postId, userId }, { rejectWithValue }) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const response = await axios.post<{ post: Post }>(`/api/posts/${postId}/unlike`, { userId }, config);

    return response.data.post;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    const error: AxiosError<ValidationErrors> = err;
    if (!error.response) {
      throw err;
    }
    return rejectWithValue(error.response.data);
  }
});

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // The `builder` callback form is used here
    // because it provides correctly typed reducers from the action creators
    builder.addCase(getPosts.fulfilled, (state, { payload }) => {
      state.posts = payload;
      state.isLoading = false;
    });
    builder.addCase(getPosts.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getPosts.rejected, (state, action) => {
      state.isLoading = false;
      if (action.payload) {
        // Being that we passed in ValidationErrors to rejectType
        // in `createAsyncThunk`, the payload will be available here.
        state.error = action.payload.errorMessage;
      } else {
        state.error = action.error.message;
      }
    });

    builder.addCase(createPost.fulfilled, (state, { payload }) => {
      state.posts = [payload, ...state.posts];
    });

    builder.addCase(createPost.rejected, (state, action) => {
      if (action.payload) {
        // Being that we passed in ValidationErrors to rejectType
        // in `createAsyncThunk`, the payload will be available here.
        state.error = action.payload.errorMessage;
      } else {
        state.error = action.error.message;
      }
    });

    builder.addCase(editPost.fulfilled, (state, { payload }) => {
      const { id } = payload;
      state.posts = state.posts.map((post) => {
        if (post.id === id) {
          return { ...payload };
        }
        return post;
      });
    });

    builder.addCase(editPost.rejected, (state, action) => {
      if (action.payload) {
        // Being that we passed in ValidationErrors to rejectType
        // in `createAsyncThunk`, the payload will be available here.
        state.error = action.payload.errorMessage;
      } else {
        state.error = action.error.message;
      }
    });

    builder.addCase(deletePost.fulfilled, (state, { payload }) => {
      const { postId } = payload;
      state.posts = state.posts.filter((post) => post.id !== postId);
    });

    builder.addCase(deletePost.rejected, (state, action) => {
      if (action.payload) {
        // Being that we passed in ValidationErrors to rejectType
        // in `createAsyncThunk`, the payload will be available here.
        state.error = action.payload.errorMessage;
      } else {
        state.error = action.error.message;
      }
    });

    builder.addCase(likePost.fulfilled, (state, { payload }) => {
      const { id } = payload;
      state.posts = state.posts.map((post) => {
        if (post.id === id) {
          return { ...payload, likesCount: post.likesCount + 1 };
        }
        return post;
      });
    });

    builder.addCase(likePost.rejected, (state, action) => {
      if (action.payload) {
        // Being that we passed in ValidationErrors to rejectType
        // in `createAsyncThunk`, the payload will be available here.
        state.error = action.payload.errorMessage;
      } else {
        state.error = action.error.message;
      }
    });

    builder.addCase(unlikePost.fulfilled, (state, { payload }) => {
      const { id } = payload;
      state.posts = state.posts.map((post) => {
        if (post.id === id) {
          return { ...payload, likesCount: post.likesCount - 1 };
        }
        return post;
      });
    });

    builder.addCase(unlikePost.rejected, (state, action) => {
      if (action.payload) {
        // Being that we passed in ValidationErrors to rejectType
        // in `createAsyncThunk`, the payload will be available here.
        state.error = action.payload.errorMessage;
      } else {
        state.error = action.error.message;
      }
    });
  },
});

export default postsSlice.reducer;
