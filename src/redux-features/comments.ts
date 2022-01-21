/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { User } from './users';

interface Comment {
  id: string;
  postId: string;
  text: string;
  userId: string;
  userInfo?: User;
  creationDate: string;
}

interface CommentsState {
  error: string | null | undefined;
  comments: Array<Comment> | [];
  isLoading: boolean | undefined;
}

const initialState: CommentsState = {
  comments: [],
  error: null,
  isLoading: false,
};

interface ValidationErrors {
  errorMessage: string;
}

export const getPostComments = createAsyncThunk<
  // Return type of the payload creator
  Array<Comment>,
  string,
  {
    // Optional fields for defining thunkApi field types
    rejectValue: ValidationErrors;
  }
>('comments/getPostComments', async (postId, { rejectWithValue }) => {
  try {
    const response = await axios.get<{ comments: Array<Comment> }>(`/api/posts/${postId}/comments`);

    return response.data.comments;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    const error: AxiosError<ValidationErrors> = err;
    if (!error.response) {
      throw err;
    }
    return rejectWithValue(error.response.data);
  }
});

export const createComment = createAsyncThunk<
  // Return type of the payload creator
  Comment,
  // postData object type
  Comment,
  {
    // Optional fields for defining thunkApi field types
    rejectValue: ValidationErrors;
  }
>('comments/createComment', async (commentData, { rejectWithValue }) => {
  try {
    const { id, postId, userId, text, creationDate } = commentData;
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const response = await axios.post<{
      comment: Comment;
    }>(
      `/api/posts/${postId}/comments`,
      {
        id,
        text,
        userId,
        creationDate,
      },
      config
    );

    return response.data.comment;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    const error: AxiosError<ValidationErrors> = err;
    if (!error.response) {
      throw err;
    }
    return rejectWithValue(error.response.data);
  }
});

const commentSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getPostComments.fulfilled, (state, { payload }) => {
      state.comments = payload;
      state.isLoading = false;
    });
    builder.addCase(getPostComments.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getPostComments.rejected, (state, action) => {
      state.isLoading = false;
      if (action.payload) {
        // Being that we passed in ValidationErrors to rejectType
        // in `createAsyncThunk`, the payload will be available here.
        state.error = action.payload.errorMessage;
      } else {
        state.error = action.error.message;
      }
    });

    builder.addCase(createComment.fulfilled, (state, { payload }) => {
      state.comments = [payload, ...state.comments];
    });

    builder.addCase(createComment.rejected, (state, action) => {
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

export default commentSlice.reducer;
