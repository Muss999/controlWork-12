import { createSlice } from "@reduxjs/toolkit";
import type { IRecipe } from "../../types";
import {
  addRecipe,
  deleteRecipe,
  getOneRecipe,
  getRecipes,
} from "./recipesThunk";

interface RecipesState {
  items: IRecipe[];
  oneRecipe: IRecipe | null;
  getRecipesFetching: boolean;
  getOneRecipeFetching: boolean;
  addRecipesFetching: boolean;
  deleteRecipesFetching: boolean;
}

const initialState: RecipesState = {
  items: [],
  oneRecipe: null,
  getRecipesFetching: false,
  getOneRecipeFetching: false,
  addRecipesFetching: false,
  deleteRecipesFetching: false,
};
const recipesSlice = createSlice({
  name: "recipes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getRecipes.pending, (state) => {
      state.getRecipesFetching = true;
    });
    builder.addCase(getRecipes.fulfilled, (state, { payload: recipes }) => {
      state.getRecipesFetching = false;
      state.items = recipes;
    });
    builder.addCase(getRecipes.rejected, (state) => {
      state.getRecipesFetching = false;
    });

    builder
      .addCase(getOneRecipe.pending, (state) => {
        state.getOneRecipeFetching = true;
        state.oneRecipe = null;
      })
      .addCase(getOneRecipe.fulfilled, (state, { payload: recipe }) => {
        state.getOneRecipeFetching = false;
        state.oneRecipe = recipe;
      })
      .addCase(getOneRecipe.rejected, (state) => {
        state.getOneRecipeFetching = false;
      });

    builder.addCase(addRecipe.pending, (state) => {
      state.addRecipesFetching = true;
    });
    builder.addCase(addRecipe.fulfilled, (state) => {
      state.addRecipesFetching = false;
    });
    builder.addCase(addRecipe.rejected, (state) => {
      state.addRecipesFetching = false;
    });

    builder.addCase(deleteRecipe.pending, (state) => {
      state.deleteRecipesFetching = true;
    });
    builder.addCase(deleteRecipe.fulfilled, (state) => {
      state.deleteRecipesFetching = false;
    });
    builder.addCase(deleteRecipe.rejected, (state) => {
      state.deleteRecipesFetching = false;
    });
  },
  selectors: {
    selectRecipes: (state) => state.items,
    selectOneRecipe: (state) => state.oneRecipe,
    selectGetRecipesFetching: (state) => state.getRecipesFetching,
    selectGetOneRecipeFetching: (state) => state.getOneRecipeFetching,
    selectAddRecipeFetching: (state) => state.addRecipesFetching,
    selectDeleteRecipeFetching: (state) => state.deleteRecipesFetching,
  },
});

export const recipesReducer = recipesSlice.reducer;
export const {
  selectRecipes,
  selectOneRecipe,
  selectGetRecipesFetching,
  selectGetOneRecipeFetching,
  selectAddRecipeFetching,
  selectDeleteRecipeFetching,
} = recipesSlice.selectors;
