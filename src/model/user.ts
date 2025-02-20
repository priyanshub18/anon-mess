import mongoose, { Schema, Document } from "mongoose";
import { boolean } from "zod";

export interface Message extends Document {
  content: string;
  createdAt: Date;
}

const messageSchema: Schema<Message> = new Schema({
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

export interface User extends Document {
  usernname: string;
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpiry: Date;
  isVerified?: boolean;
  isAccepting?: boolean;
  messages: Message[];
}

const UserSchema: Schema<User> = new Schema({
  usernname: {
    type: String,
    required: [true, "Username is required"],
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Invalid email address"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  verifyCode: {
    type: String,
    default: "",
  },
  verifyCodeExpiry: {
    type: Date,
    required: [true, "Verify code expiry is required"],
    default: Date.now,
  },
  isVerified: {
    type: boolean,
    default: false,
  },
  isAccepting: {
    type: boolean,
    default: false,
  },
  messages: {
    type: [messageSchema],
    default: [],
  },
});

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", UserSchema);
const MessageModel = (mongoose.models.Message as mongoose.Model<Message>) || mongoose.model<Message>("Message", messageSchema);

export { UserModel, MessageModel };
