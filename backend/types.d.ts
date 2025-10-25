import mongoose, { mongo } from "mongoose";

export interface IUser {
  username: string;
  password: string;
  token: string;
  displayName: string;
  email: string;
  avatar: string | null;
  googleId?: string;
}

export interface IComment {
  author: mongoose.Types.ObjectId;
  recipeId: mongoose.Types.ObjectId;
  text: string;
}
export interface IRecipe {
  author: mongoose.Types.ObjectId;
  name: string;
  recipe: string;
  image: string | null;
}
