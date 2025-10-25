import mongoose from "mongoose";
import User from "./User";
import { IComment } from "../types";
import Recipe from "./Recipe";
const Schema = mongoose.Schema;

const CommentSchema = new Schema<IComment>({
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    validate: {
      validator: async (value: mongoose.Types.ObjectId) => {
        const user = await User.findById(value);
        return Boolean(user);
      },
      message: "User doesn't exist",
    },
  },
  recipeId: {
    type: Schema.Types.ObjectId,
    ref: "Recipe",
    required: true,
    validate: {
      validator: async (value: mongoose.Types.ObjectId) => {
        const recipe = await Recipe.findById(value);
        return Boolean(recipe);
      },
      message: "Recipe doesn't exist",
    },
  },
  text: {
    type: String,
    trim: true,
    required: true,
  },
});

const Comment = mongoose.model("Comment", CommentSchema);
export default Comment;
