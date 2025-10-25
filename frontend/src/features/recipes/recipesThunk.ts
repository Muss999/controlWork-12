import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosApi from "../../axiosApi";
import { isAxiosError } from "axios";
import type { RootState } from "../../app/store";
import type { IRecipe, IRecipeForm } from "../../types";

export const getRecipes = createAsyncThunk<IRecipe[]>(
  "recipes/get",
  async () => {
    const { data } = await axiosApi.get<IRecipe[]>("/recipes");
    return data;
  }
);

export const getOneRecipe = createAsyncThunk<IRecipe, string>(
  "recipes/getOne",
  async (id) => {
    const { data: recipe } = await axiosApi.get<IRecipe>(`/recipes/${id}`);
    return recipe;
  }
);

export const addRecipe = createAsyncThunk<
  void,
  IRecipeForm,
  { state: RootState }
>("recipe/add", async (recipe, { rejectWithValue, getState }) => {
  const token = getState().users.user?.token;
  if (!token) {
    return rejectWithValue("Invalid user token");
  }
  const formData = new FormData();
  formData.append("name", recipe.name);
  formData.append("recipe", recipe.recipe);

  if (recipe.image) {
    formData.append("image", recipe.image);
  }

  try {
    await axiosApi.post("/recipes", formData, {
      headers: { Authorization: token },
    });
  } catch (e) {
    if (isAxiosError(e) && e.response && e.response.status === 400) {
      return rejectWithValue(e.response.data);
    }

    throw e;
  }
});

export const deleteRecipe = createAsyncThunk<
  void,
  string,
  { state: RootState }
>("recipe/delete", async (recipeId, { rejectWithValue, getState }) => {
  const token = getState().users.user?.token;
  if (!token) {
    return rejectWithValue("Invalid user token");
  }

  try {
    await axiosApi.delete(`/recipes/${recipeId}`, {
      headers: { Authorization: token },
    });
  } catch (e) {
    if (isAxiosError(e) && e.response) {
      if (e.response.data?.error) {
        return rejectWithValue(e.response.data.error);
      }
      if (typeof e.response.data === "string") {
        return rejectWithValue(e.response.data);
      }
      return rejectWithValue("Something went wrong");
    }

    throw e;
  }
});
