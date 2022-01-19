/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { User } from './users';

interface Comment {
  id: string;
  postId: string;
  text: string;
  userInfo: User;
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
  },
});

export default commentSlice.reducer;
