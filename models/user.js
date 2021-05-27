const mongoose = require("mongoose");
const Joi = require("joi");
const { Friend } = require("./friend");
const { Post } = require("./post");

const userSchema = new mongoose.Schema({
  email: { type: String, require: true, minlength: 6, maxlength: 50 },
  password: { type: String, require: true, minlength: 3, maxlength: 20 },
  firstName: { type: String, require: true, minlength: 2, maxlength: 50 },
  lastName: { type: String, require: true, minlength: 2, maxlength: 50 },
  favoriteArtist: { type: String },
  favoriteAlbum: { type: String },
  favoriteSong: { type: String },
  friends: [Friend.schema],
  posts: [Post.schema],
});

const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = Joi.object({
    email: Joi.string().min(6).max(50).required().email(),
    password: Joi.string().min(3).max(20).required(),
    firstName: Joi.string().min(2).max(50).required(),
    lastName: Joi.string().min(2).max(50).required(),
    favoriteArtist: Joi.string(),
    favoriteAlbum: Joi.string(),
    favoriteSong: Joi.string(),
  });
  return schema.validate(user);
}

exports.User = User;
exports.validateUser = validateUser;
exports.userSchema = userSchema;
