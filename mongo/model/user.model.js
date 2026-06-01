import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  bestScore: {
    type: Number,
    default: 0,
    min: 0,
  },
  gamesPlayed: {
    type: Number,
    default: 0,
    min: 0,
  },
  coins: {
    type: Number,
    default: 0,
    min: 0,
  },
});

export const User =mongoose.model("User",userSchema);
