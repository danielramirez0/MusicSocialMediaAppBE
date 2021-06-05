const mongoose = require("mongoose");
const Joi = require("joi");

const postSchema = new mongoose.Schema({
  body: { type: String, required: true },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  date: {type: Date, default:Date.now},
});

const Post = mongoose.model("Post", postSchema);

const validatePost = (Post) => {
  const schema = Joi.object({
    body: Joi.string().required(),
    likes: Joi.number(),
    dislikes: Joi.number(),
  });
  return schema.validate(Post);
};

exports.Post = Post;
exports.validatePost = validatePost;
exports.postSchema = postSchema;