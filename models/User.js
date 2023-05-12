const mongoose = require("mongoose");

const userSchema = {
  email: { type: String, required: true, unique: true },
  account: {
    username: String,
  },
  token: String,
  hash: String,
  salt: String,
  favorites: {
    comics: [String], // could be typed as a set
    characters: [String],
  },
};

const User = mongoose.model("User", userSchema);

module.exports = User;
