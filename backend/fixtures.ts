import mongoose from "mongoose";
import config from "./config";
import { randomUUID } from "node:crypto";
import User from "./models/User";
import Recipe from "./models/Recipe";
import Comment from "./models/Comment";

const run = async () => {
  await mongoose.connect(config.db);
  const db = mongoose.connection;

  try {
    await db.dropCollection("users");
    await db.dropCollection("recipes");
    await db.dropCollection("comments");
  } catch (e) {
    console.log("Collections were not present, skipping drop...");
  }

  const [Tom, Max, Somi] = await User.create(
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
    },
    {
      username: "3",
      displayName: "Somi",
      password: "3",
      email: "somi@gmail.com",
      avatar: "/fixtures/somiAvatar.webp",
      token: randomUUID(),
    }
  );

  const [recipe1, recipe2, recipe3, recipe4] = await Recipe.create([
    {
      author: Tom._id,
      name: "Homemade Pilaf",
      image: "/fixtures/recipes/pilaf.jpg",
      recipe:
        "Fry the meat, add carrots and onions, then pour rice and simmer until tender.",
    },
    {
      author: Max._id,
      name: "Classic Olivier Salad",
      image: "/fixtures/recipes/olivier.jpg",
      recipe:
        "Boil potatoes, carrots, and eggs. Dice them, add sausage, peas, and mayonnaise. Mix well.",
    },
    {
      author: Somi._id,
      name: "Fluffy Pancakes",
      image: "/fixtures/recipes/pancakes.jpeg",
      recipe:
        "Mix milk, eggs, flour, and sugar. Fry on both sides until golden brown.",
    },
    {
      author: Tom._id,
      name: "Pasta Carbonara",
      image: "/fixtures/recipes/carbonara.jpg",
      recipe:
        "Cook spaghetti, fry bacon, then add cream, eggs, and cheese. Stir over low heat.",
    },
  ]);

  await Comment.create([
    {
      author: Max._id,
      recipeId: recipe1._id,
      text: "Tried this recipe — it turned out amazing! Especially with beef.",
    },
    {
      author: Somi._id,
      recipeId: recipe1._id,
      text: "Added some raisins — gave it a nice twist!",
    },
    {
      author: Tom._id,
      recipeId: recipe1._id,
      text: "Glad you all liked it",
    },
    {
      author: Tom._id,
      recipeId: recipe2._id,
      text: "It’s not New Year without Olivier salad!",
    },
    {
      author: Somi._id,
      recipeId: recipe2._id,
      text: "Used chicken instead of sausage — still delicious.",
    },
    {
      author: Tom._id,
      recipeId: recipe3._id,
      text: "They turned out fluffy and soft, thanks for sharing!",
    },
    {
      author: Max._id,
      recipeId: recipe3._id,
      text: "Added a banana to the batter — sweet and tasty!",
    },
    {
      author: Somi._id,
      recipeId: recipe3._id,
      text: "Now I make these every weekend",
    },
    {
      author: Max._id,
      recipeId: recipe4._id,
      text: "Used sour cream instead of heavy cream — still good!",
    },
    {
      author: Somi._id,
      recipeId: recipe4._id,
      text: "The key is not to overcook the bacon. Perfect recipe.",
    },
    {
      author: Tom._id,
      recipeId: recipe4._id,
      text: "Italian food is pure love",
    },
  ]);

  await db.close();
};

run().catch(console.error);
