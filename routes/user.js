// const { Comment, Reply, validateComment, validateReply } = require ('../models/comment');
const { User, Post, validateUser, validatePost, validateFriend } = require("../models/user");
const express = require("express");
const router = express.Router();

//get all users
router.get("/", async (req, res) => {
  try {
    const user = await User.find();
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
    user ? res.statust(400).send("User already registered") : null;

    user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
    });

    await user.save();

    return res.send({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    });
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

//put for likes / dislikes
router.put("/:id/likes", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(400).send(`The comment id "${req.params.id}" does not exist.`);

    post.likes++;

    await post.save();
    return res.send(post);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

router.put("/:id/dislikes", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(400).send(`The comment id "${req.params.id}" does not exist.`);

    post.dislikes++;

    await post.save();
    return res.send(post);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

//post reply
router.post("/:commentId/replies", async (req, res) => {
  try {
    const { error } = validateReply(req.body);
    if (error) return res.status(400).send(error);

    const comment = await Comment.findById(req.params.commentId);
    if (!comment)
      return res.status(400).send(`The comment id "${req.params.commentId}" does not exist.`);

    const reply = new Reply({
      text: req.body.text,
    });

    comment.replies.push(reply);
    await comment.save();

    return res.send(comment.replies);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

//delete comment
router.delete("/:id", async (req, res) => {
  try {
    const comment = await Comment.findByIdAndRemove(req.params.id);
    if (!comment) return res.status(400).send(`The comment id "${req.params.id}" does not exist.`);
    return res.send(comment);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

module.exports = router;
