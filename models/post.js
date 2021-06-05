const mongoose = require("mongoose");
const Joi = require("joi");

const postSchema = new mongoose.Schema({
  time: { type: String, required: true },
  mood: { type: String, required: true },
  text: { type: String, required: true },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
});

const Post = mongoose.model("Post", postSchema);

function validatePost(post) {
  const schema = Joi.object({
    time: Joi.string().required(),
    mood: Joi.string().required(),
    text: Joi.string().required(),
    likes: Joi.number(),
    dislikes: Joi.number(),
  });
  return schema.validate(post);
}

exports.Post = Post;
exports.validatePost = validatePost;
exports.postSchema = postSchema;
