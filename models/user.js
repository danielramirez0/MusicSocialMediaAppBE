const mongoose = require("mongoose");
const Joi = require("joi");
const { Friend, FriendRequest } = require("./friend");
const { Post } = require("./post");
const config = require("config");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  email: { type: String, require: true, minlength: 2, maxlength: 255 },
  password: { type: String, require: true, minlength: 3, maxlength: 1024 },
  firstName: { type: String, require: true, minlength: 2, maxlength: 50 },
  lastName: { type: String, require: true, minlength: 2, maxlength: 50 },
  favoriteArtist: { type: String },
  favoriteAlbum: { type: String },
  favoriteSong: { type: String },
  friends: [Friend.schema],
  friendRequests: [FriendRequest.schema],
  posts: [Post.schema],
});
userSchema.methods.generateAuthToken = () => {
  return jwt.sign(
    {
      _id: this._id,
      firstName: this.firstName,
      lastName: this.lastName,
      favoriteArtist: this.favoriteArtist,
      favoriteAlbum: this.favoriteAlbum,
      favoriteSong: this.favoriteSong,
      friends: this.friends,
      posts: this.posts,
    },
    config.get("jwtSecret")
  );
};

const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = Joi.object({
    email: Joi.string().min(2).max(255).required().email(),
    password: Joi.string().min(3).max(1024).required(),
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
