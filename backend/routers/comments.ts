import express from "express";
import mongoose from "mongoose";
import { imagesUpload } from "../multer";
import auth, { RequestWithUser } from "../middleware/auth";
import Comment from "../models/Comment";
import { IComment, IRecipe } from "../types";

export const commentsRouter = express.Router();

commentsRouter.get("/", async (req, res) => {
  try {
    const { recipeId } = req.query;

    if (!recipeId || typeof recipeId !== "string") {
      return res.status(400).send({ error: "Recipe ID is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(recipeId)) {
      return res.status(400).send({ error: "Invalid recipe ID" });
    }

    const comments = await Comment.find({ recipeId }).populate("author").exec();

    res.send(comments);
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

commentsRouter.post(
  "/",
  auth,
  imagesUpload.single("image"),
  async (req, res, next) => {
    const user = (req as RequestWithUser).user;
    const recipeId = new mongoose.Types.ObjectId(req.params.id);

    const text: string = req.body.text;

    const commentData: IComment = {
      author: user._id,
      recipeId,
      text,
    };

    try {
      const comment = new Comment(commentData);
      await comment.save();

      res.send(comment);
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        return res.status(400).send(error);
      }
      next(error);
    }
  }
);

commentsRouter.delete("/", auth, async (req, res) => {
  try {
    const user = (req as RequestWithUser).user;
    const { commentId } = req.body;

    if (!commentId) {
      return res.status(400).send({ error: "Comment ID is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      return res.status(400).send({ error: "Wrong comment ID" });
    }

    const comment = await Comment.findById(commentId)
      .populate<{ recipeId: IRecipe }>("recipeId")
      .exec();

    if (!comment) {
      return res.status(404).send({ error: "Comment not found" });
    }

    const recipe = comment.recipeId as IRecipe;
    const recipeAuthorId = recipe.author.toString();

    if (
      comment.author.toString() === user._id.toString() ||
      recipeAuthorId === user._id.toString()
    ) {
      await comment.deleteOne();
      return res.send({ message: "Comment was deleted successfully" });
    } else {
      return res.status(401).send({ error: "You can't delete this comment" });
    }
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});
