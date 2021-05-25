const mongoose = require("mongoose");
// const { User } = require("./User");
const Joi = require("joi");

const friendSchema = new mongoose.Schema({
  firstName: { type: String, required: true, minlength: 2, maxlength: 50 },
  lastName: { type: String, required: true, minlength: 2, maxlength: 50 },
});

const friend = mongoose.model("Friend", friendSchema);

function validateFriend(friend) {
  const schema = Joi.object({
    firstName: Joi.string().min(2).max(50).required(),
    lastName: Joi.string().min(2).max(50).required(),
  });
  return schema.validate(friend);
}

exports.Friend = friend;
exports.validateFriend = validateFriend;
exports.friendSchema = friendSchema;
