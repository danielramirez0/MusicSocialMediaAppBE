// const { Comment, Reply, validateComment, validateReply } = require ('../models/comment');
const { User, validateUser } = require("../models/user");
const { Friend, validateFriend } = require("../models/friend");
const bcrypt = require("bcrypt");
const auth = require("../middleware/auth");
const express = require("express");
const router = express.Router();

// get all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    return res.send(users);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    return res.send(user);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

//register new User
router.post("/", async (req, res) => {
  try {
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send("User already registered");

    const salt = await bcrypt.genSalt(10);

    user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: await bcrypt.hash(req.body.password, salt),
      favoriteArtist: req.body.favoriteArtist,
      favoriteAlbum: req.body.favoriteAlbum,
      favoriteSong: req.body.favoriteSong,
    });

    await user.save();

    const token = user.generateAuthToken();

    return res
      .header("x-auth-token", token)
      .header("access-control-expose-headers", "x-auth-token")
      .send({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        favoriteArtist: user.favoriteArtist,
        favoriteAlbum: user.favoriteAlbum,
        favoriteSong: user.favoriteSong,
      });
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

// add new friend
router.post("/:userId/friends/:friendId/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(400).send(`The user id "${req.params.userId}" does not exist.`);

    let friend = await User.findById(req.params.friendId);
    if (!friend)
      return res.status(400).send(`The friend user id "${req.params.friendId}" does not exist.`);

    const { error } = validateFriend({
      _id: `${friend._id}`,
      name: `${friend.firstName} ${friend.lastName}`,
    });

    if (error) return res.status(400).send(error);

    const fullName = `${friend.firstName} ${friend.lastName}`;

    friend = new Friend({
      _id: req.params.friendId,
      name: fullName,
    });

    user.friends.push(friend);

    await user.save();

    return res.send(user);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

//delete user
router.delete("/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndRemove(req.params.id);

    if (!user) return res.status(400).send(`The user id "${req.params.id}" does not exist.`);

    return res.send(user);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

module.exports = router;
