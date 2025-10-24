import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosApi from "../../axiosApi.ts";
import type {
  GlobalError,
  IUser,
  IUserLogin,
  IUserRegister,
  ValidationError,
} from "../../types";
import { isAxiosError } from "axios";
import { unsetUser } from "./usersSlice.ts";
import type { RootState } from "../../app/store.ts";

export const register = createAsyncThunk<
  IUser,
  IUserRegister,
  { rejectValue: ValidationError }
>("users/register", async (userRegister, { rejectWithValue }) => {
  try {
    const formData = new FormData();
    formData.append("username", userRegister.username);
    formData.append("password", userRegister.password);
    formData.append("displayName", userRegister.displayName);
    formData.append("email", userRegister.email);

    if (userRegister.avatar) {
      formData.append("avatar", userRegister.avatar);
    }

    const { data: user } = await axiosApi.post<IUser>("/users", formData);

    return user;
  } catch (e) {
    if (isAxiosError(e) && e.response && e.response.status === 400) {
      return rejectWithValue(e.response.data);
    }
    throw e;
  }
});
export const login = createAsyncThunk<
  IUser,
  IUserLogin,
  { rejectValue: GlobalError }
>("users/login", async (userLogin, { rejectWithValue }) => {
  try {
    const { data: user } = await axiosApi.post<IUser>(
      "/users/sessions",
      userLogin
    );
    return user;
  } catch (e) {
    if (isAxiosError(e) && e.response && e.response.status === 400) {
      return rejectWithValue(e.response.data);
    }

    throw e;
  }
});
export const googleLogin = createAsyncThunk<
  IUser,
  string,
  { rejectValue: GlobalError }
>("users/googleLogin", async (credential, { rejectWithValue }) => {
  try {
    const { data: user } = await axiosApi.post<IUser>("/users/google", {
      credential,
    });
    return user;
  } catch (e) {
    if (isAxiosError(e) && e.response && e.response.status === 400) {
      return rejectWithValue(e.response.data);
    }

    throw e;
  }
});
export const logout = createAsyncThunk<void, undefined, { state: RootState }>(
  "users/logout",
  async (_, { getState, dispatch }) => {
    const token = getState().users.user?.token;
    await axiosApi.delete("/users/sessions", {
      headers: { Authorization: token },
    });
    dispatch(unsetUser());
  }
);
