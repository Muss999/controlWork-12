import express from "express";
import User from "../models/User";
import mongoose from "mongoose";
import { randomUUID } from "crypto";
import { IUser } from "../types";
import { OAuth2Client } from "google-auth-library";
import config from "../config";
import { imagesUpload } from "../multer";

export const usersRouter = express.Router();
const googleClient = new OAuth2Client(config.google.clientId);

usersRouter.post("/", imagesUpload.single("avatar"), async (req, res, next) => {
  const username: string = req.body.username;
  const password: string = req.body.password;
  const displayName: string = req.body.displayName;
  const email: string = req.body.email;

  const userData: Omit<IUser, "role"> = {
    username,
    password,
    displayName,
    email,
    token: randomUUID(),
    avatar: req.file ? req.file.filename : null,
  };

  try {
    const user = new User(userData);
    await user.save();

    res.send(user);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).send(error);
    }
    next(error);
  }
});

usersRouter.post("/sessions", async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username });

    if (!user) {
      return res.status(400).send({ error: "Username not found" });
    }

    const isMatch = await user.checkPassword(req.body.password);
    if (!isMatch) {
      return res.status(400).send({ error: "Wrong password" });
    }

    user.generateToken();
    await user.save();

    res.send(user);
  } catch (e) {
    next(e);
  }
});

usersRouter.post("/google", async (req, res, next) => {
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: req.body.credential,
      audience: config.google.clientId,
    });
    const payload = ticket.getPayload();

    if (!payload) {
      return res.status(400).send({ error: "Google login error" });
    }

    const email = payload.email;
    const id = payload.sub;
    const displayName = payload.name;
    const avatar = payload.picture;

    if (!email) {
      return res
        .status(400)
        .send({ error: "Not enough user data to continue" });
    }

    let user = await User.findOne({ googleId: id });

    if (!user) {
      user = new User({
        username: email,
        password: crypto.randomUUID(),
        googleId: id,
        displayName,
        avatar,
        email,
      });
    } else {
      if (!user.email && payload.email) {
        user.email = payload.email;
      }
    }
    user.generateToken();
    await user.save();

    res.send(user);
  } catch (e) {
    next(e);
  }
});

usersRouter.delete("/sessions", async (req, res, next) => {
  try {
    const token = req.get("Authorization");

    if (!token) {
      return res.status(204).send();
    }

    const user = await User.findOne({ token });

    if (!user) {
      return res.status(204).send();
    }

    user.generateToken();
    user.save();

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});
