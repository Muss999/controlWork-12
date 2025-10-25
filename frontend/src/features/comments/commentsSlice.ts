import { createSlice } from "@reduxjs/toolkit";
import type { IComment } from "../../types";
import { addComment, deleteComment, getComments } from "./commentsThunk";

interface CommentsState {
  items: IComment[];
  getCommentsFetching: boolean;
  addCommentsFetching: boolean;
  deleteCommentFetching: boolean | string;
  addCommentError: string | null;
}

const initialState: CommentsState = {
  items: [],
  getCommentsFetching: false,
  addCommentsFetching: false,
  deleteCommentFetching: false,
  addCommentError: null,
};
const commentsSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getComments.pending, (state) => {
      state.getCommentsFetching = true;
    });
    builder.addCase(getComments.fulfilled, (state, { payload: comments }) => {
      state.getCommentsFetching = false;
      state.items = comments;
    });
    builder.addCase(getComments.rejected, (state) => {
      state.getCommentsFetching = false;
    });

    builder.addCase(addComment.pending, (state) => {
      state.addCommentsFetching = true;
      state.addCommentError = null;
    });
    builder.addCase(addComment.fulfilled, (state) => {
      state.addCommentsFetching = false;
      state.addCommentError = null;
    });
    builder.addCase(addComment.rejected, (state, action) => {
      state.addCommentsFetching = false;
      state.addCommentError =
        (action.payload as string) || "Failed to add comment";
    });

    builder.addCase(deleteComment.pending, (state, action) => {
      state.deleteCommentFetching = action.meta.arg;
    });
    builder.addCase(deleteComment.fulfilled, (state) => {
      state.deleteCommentFetching = false;
    });
    builder.addCase(deleteComment.rejected, (state) => {
      state.deleteCommentFetching = false;
    });
  },
  selectors: {
    selectComments: (state) => state.items,
    selectGetCommentsFetching: (state) => state.getCommentsFetching,
    selectAddCommentFetching: (state) => state.addCommentsFetching,
    selectDeleteCommentFetching: (state) => state.deleteCommentFetching,
    selectAddCommentError: (state) => state.addCommentError,
  },
});

export const commentsReducer = commentsSlice.reducer;
export const {
  selectComments,
  selectGetCommentsFetching,
  selectAddCommentFetching,
  selectDeleteCommentFetching,
  selectAddCommentError,
} = commentsSlice.selectors;
