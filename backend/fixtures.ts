import mongoose from "mongoose";
import config from "./config";
import { randomUUID } from "node:crypto";
import User from "./models/User";

const run = async () => {
  await mongoose.connect(config.db);
  const db = mongoose.connection;

  try {
    await db.dropCollection("users");
  } catch (e) {
    console.log("Collections were not present, skipping drop...");
  }

  const [userTom, userMax] = await User.create(
    {
      username: "1",
      displayName: "Thomas",
      password: "1",
      email: "thomas@gmail.com",
      avatar: "/fixtures/thomasAvatar.png",
      token: randomUUID(),
    },
    {
      username: "2",
      displayName: "Max",
      password: "2",
      email: "max@gmail.com",
      avatar: "/fixtures/maxAvatar.jpg",
      token: randomUUID(),
    }
  );

  await db.close();
};

run().catch(console.error);
