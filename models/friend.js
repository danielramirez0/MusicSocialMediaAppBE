const mongoose = require("mongoose");
const Joi = require("joi");

const requestSchema = new mongoose.Schema({
  email: { type: String, required: true, minlength: 2, maxlength: 255 },
  name: { type: String, required: true, minlength: 2, maxlength: 255 },
});

const FriendRequest = mongoose.model("FriendRequest", requestSchema);

function validateFriendRequest(friendRequest) {
  const schema = Joi.object({
    email: Joi.string().min(2).max(255).required(),
    name: Joi.string().min(2).max(255).required(),
  });
}

const friendSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true, minlength: 2, maxlength: 255 },
  pending: { type: Boolean, required: true, default: true },
});

const Friend = mongoose.model("Friend", friendSchema);

function validateFriend(friend) {
  const schema = Joi.object({
    _id: Joi.string().required(),
    name: Joi.string().min(2).max(255).required(),
  });
  return schema.validate(friend);
}

exports.Friend = Friend;
exports.validateFriend = validateFriend;
exports.friendSchema = friendSchema;

module.FriendRequst = FriendRequest;
exports.validateFriendRequest = validateFriendRequest;
exports.requestSchema = requestSchema;
