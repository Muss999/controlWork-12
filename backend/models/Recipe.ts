import mongoose from "mongoose";
import User from "./User";
import { IRecipe } from "../types";
const Schema = mongoose.Schema;

const RecipeSchema = new Schema<IRecipe>({
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
  name: {
    type: String,
    trim: true,
    required: true,
  },
  image: {
    type: String,
    default: null,
  },
  recipe: {
    type: String,
    trim: true,
    required: true,
  },
});

const Recipe = mongoose.model("Recipe", RecipeSchema);
export default Recipe;
