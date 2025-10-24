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

  const [admin, userMax] = await User.create(
    {
      username: "1",
      displayName: "Administrator",
      password: "1",
      email: "admin@gmail.com",
      avatar: "/fixtures/adminAvatar.png",
      token: randomUUID(),
      role: "admin",
    },
    {
      username: "2",
      password: "2",
      displayName: "Max",
      email: "max@gmail.com",
      avatar: "/fixtures/maxAvatar.jpg",
      token: randomUUID(),
      role: "user",
    }
  );

  await db.close();
};

run().catch(console.error);
