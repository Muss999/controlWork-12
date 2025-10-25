import { createSlice } from "@reduxjs/toolkit";
import type { IComment } from "../../types";
import { addComment, deleteComment, getComments } from "./commentsThunk";

interface CommentsState {
  items: IComment[];
  getCommentsFetching: boolean;
  addCommentsFetching: boolean;
  deleteCommentFetching: boolean | string;
}

const initialState: CommentsState = {
  items: [],
  getCommentsFetching: false,
  addCommentsFetching: false,
  deleteCommentFetching: false,
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
    });
    builder.addCase(addComment.fulfilled, (state) => {
      state.addCommentsFetching = false;
    });
    builder.addCase(addComment.rejected, (state) => {
      state.addCommentsFetching = false;
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
  },
});

export const commentsReducer = commentsSlice.reducer;
export const {
  selectComments,
  selectGetCommentsFetching,
  selectAddCommentFetching,
  selectDeleteCommentFetching,
} = commentsSlice.selectors;
