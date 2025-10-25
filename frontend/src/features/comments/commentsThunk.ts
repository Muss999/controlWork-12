import { createAsyncThunk } from "@reduxjs/toolkit";
import type { IComment, ICommentForm } from "../../types";
import axiosApi from "../../axiosApi";
import type { RootState } from "../../app/store";
import { isAxiosError } from "axios";

export const getComments = createAsyncThunk<IComment[], string>(
  "comments/get",
  async (recipeId) => {
    const { data } = await axiosApi.get<IComment[]>(
      `/comments?recipeId=${recipeId}`
    );
    return data;
  }
);

export const addComment = createAsyncThunk<
  IComment,
  ICommentForm,
  { state: RootState; rejectValue: string }
>("comments/add", async (comment, { rejectWithValue, getState }) => {
  const token = getState().users.user?.token;
  if (!token) {
    return rejectWithValue("Invalid user token");
  }

  try {
    const { data } = await axiosApi.post<IComment>("/comments", comment, {
      headers: { Authorization: token },
    });
    return data;
  } catch (e) {
    if (isAxiosError(e) && e.response) {
      if (e.response.status === 400 && e.response.data) {
        return rejectWithValue(e.response.data.error || "Validation error");
      }
      return rejectWithValue(e.response.data?.error || "Failed to add comment");
    }
    throw e;
  }
});

export const deleteComment = createAsyncThunk<
  void,
  string,
  { state: RootState; rejectValue: string }
>("comments/delete", async (commentId, { rejectWithValue, getState }) => {
  const token = getState().users.user?.token;
  if (!token) {
    return rejectWithValue("Invalid user token");
  }

  try {
    await axiosApi.delete("/comments", {
      headers: { Authorization: token },
      data: { commentId },
    });
  } catch (e) {
    if (isAxiosError(e) && e.response) {
      if (e.response.data?.error) {
        return rejectWithValue(e.response.data.error);
      }
      return rejectWithValue("Failed to delete comment");
    }
    throw e;
  }
});
