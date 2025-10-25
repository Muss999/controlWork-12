import mongoose, { Model } from "mongoose";
import { IUser } from "../types";
import bcrypt from "bcrypt";
import { randomUUID } from "crypto";

interface UserMethods {
  checkPassword(password: string): Promise<boolean>;
  generateToken(): void;
}

type UserModel = Model<IUser, {}, UserMethods>;

const Schema = mongoose.Schema;

const SALT_WORK_FACTOR = 10;

const UserSchema = new Schema<IUser, UserModel, UserMethods>({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    validate: {
      validator: async function (value: string): Promise<boolean> {
        if (!this.isModified("username")) {
          return true;
        }
        const user = await User.findOne({ username: value });
        return Boolean(!user);
      },
      message: "This username is already exist",
    },
  },
  password: {
    type: String,
    trim: true,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  displayName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  googleId: String,
  avatar: {
    type: String || null,
    required: true,
  },
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
  const hash = await bcrypt.hash(this.password, salt);

  this.password = hash;
  next();
});

UserSchema.set("toJSON", {
  transform: (_doc, ret: Partial<IUser>) => {
    delete ret.password;
    return ret;
  },
});

UserSchema.methods.checkPassword = function (password: string) {
  return bcrypt.compare(password, this.password);
};

UserSchema.methods.generateToken = function () {
  this.token = randomUUID();
};

const User = mongoose.model<IUser, UserModel>("User", UserSchema);
export default User;
