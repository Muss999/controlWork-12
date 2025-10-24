import { configDotenv } from "dotenv";
import path from "path";

const rootPath = __dirname;
configDotenv();

const config = {
  rootPath,
  publicPath: path.join(rootPath, "public"),
  db: "mongodb://localhost/controlwork12",
  google: {
    clientId: process.env.GOOGLE_CLIEND_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  },
};

export default config;
