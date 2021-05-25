// const { Comment, Reply, validateComment, validateReply } = require ('../models/comment');
const express = require("express");
const router = express.Router();

//get all videos
router.get("/", async (req, res) => {
  try {
    const comment = await Comment.find();
    return res.send(comment);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

//post comment
router.post("/", async (req, res) => {
  try {
    const { error } = validateComment(req.body);
    if (error) return res.status(400).send(error);

    const comment = new Comment({
      text: req.body.text,
      videoId: req.body.videoId,
    });

    await comment.save();

    return res.send(comment);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

//put for likes / dislikes
router.put("/:id/likes", async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(400).send(`The comment id "${req.params.id}" does not exist.`);

    comment.likes++;

    await comment.save();
    return res.send(comment);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

router.put("/:id/dislikes", async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(400).send(`The comment id "${req.params.id}" does not exist.`);

    comment.dislikes++;

    await comment.save();
    return res.send(comment);
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
