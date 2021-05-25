const mongoose = require("mongoose");
const Joi = require("joi");

const postSchema = new mongoose.Schema({
  body: { type: String, required: true },
});

const post = mongoose.model("Post", postSchema);

const validatePost = (post) => {
  const schema = Joi.object({
    body: Joi.string().required(),
  });
  return schema.validate(post);
};

exports.Post = post;
exports.validatePost = validatePost;
exports.postSchema = postSchema;
