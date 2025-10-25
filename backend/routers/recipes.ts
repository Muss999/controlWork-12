import express from "express";
import mongoose from "mongoose";
import Recipe from "../models/Recipe";
import { imagesUpload } from "../multer";
import auth, { RequestWithUser } from "../middleware/auth";
import { IRecipe } from "../types";

export const recipesRouter = express.Router();

recipesRouter.get("/", async (req, res) => {
  try {
    const recipes = await Recipe.find().populate("author").exec();
    res.send(recipes);
  } catch {
    res.sendStatus(500);
  }
});

recipesRouter.get("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).send({ error: "Invalid recipe ID" });
    }
    const fullRecipeInfo = await Recipe.findById(req.params.id)
      .populate("author")
      .exec();
    if (!fullRecipeInfo) {
      return res.status(404).send({ error: "Recipe not found" });
    }
    res.send(fullRecipeInfo);
  } catch {
    res.sendStatus(500);
  }
});

recipesRouter.post(
  "/",
  auth,
  imagesUpload.single("image"),
  async (req, res, next) => {
    const user = (req as RequestWithUser).user;

    const name: string = req.body.name;
    const recipe: string = req.body.recipe;

    const recipeData: IRecipe = {
      author: user._id,
      name,
      recipe,
      image: req.file ? req.file.filename : null,
    };

    try {
      const recipe = new Recipe(recipeData);
      await recipe.save();

      res.send(recipe);
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        return res.status(400).send(error);
      }
      next(error);
    }
  }
);

recipesRouter.delete("/:id", auth, async (req, res) => {
  try {
    const user = (req as RequestWithUser).user;
    const { recipeId } = req.body;

    if (!recipeId) {
      return res.status(400).send({ error: "Recipe ID is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(recipeId)) {
      return res.status(400).send({ error: "Wrong recipe ID" });
    }

    const recipe = await Recipe.findById(recipeId);

    if (!recipe) {
      return res.status(404).send({ error: "Recipe not found" });
    }
    if (recipe.author.toString() === user._id.toString()) {
      await recipe.deleteOne();
      return res.send({ message: "Recipe was deleted successfully" });
    } else {
      return res.status(401).send({ error: "You can't delete this recipe" });
    }
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});
