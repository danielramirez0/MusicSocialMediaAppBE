const mongoose = require("mongoose");
const Joi = require("joi");

const requestSchema = new mongoose.Schema({
  user_id: { type: mongoose.Types.ObjectId, required: true },
  name: { type: String, required: true, minlength: 2, maxlength: 255 },
  approve: { type: Boolean, required: true, default: false },
});

const FriendRequest = mongoose.model("FriendRequest", requestSchema);

function validateFriendRequest(friendRequest) {
  const schema = Joi.object({
    user_id: Joi.required(),
    name: Joi.string().min(2).max(255).required(),
  });
  return schema.validate(friendRequest);
}

const friendSchema = new mongoose.Schema({
  user_id: { type: mongoose.Types.ObjectId, required: true },
  name: { type: String, required: true, minlength: 2, maxlength: 255 },
  pending: { type: Boolean, required: true, default: true },
});

const Friend = mongoose.model("Friend", friendSchema);

function validateFriend(friend) {
  const schema = Joi.object({
    user_id: Joi.required(),
    name: Joi.string().min(2).max(255).required(),
  });
  return schema.validate(friend);
}

exports.Friend = Friend;
exports.validateFriend = validateFriend;
exports.friendSchema = friendSchema;

exports.FriendRequest = FriendRequest;
exports.validateFriendRequest = validateFriendRequest;
exports.requestSchema = requestSchema;
