const { User } = require("../models/user");
const { Post, validatePost } = require("../models/post");
const auth = require("../middleware/auth");
const express = require("express");
const router = express.Router();

//post a new post
router.post("/:id/post", auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(400).send(`The user id "${req.params.id}" does not exist.`);

    const { error } = validatePost(req.body);
    if (error) return res.status(400).send(error);

    const post = new Post({
      body: req.body.body,
    });

    user.posts.push(post);
    await user.save();

    return res.send(user.posts);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

//put for post likes
router.put("/:userId/:postId/likes", auth, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.userId);
    if (!user) return res.status(400).send(`The user id "${req.params.userId}" does not exist.`);

    user.posts.filter((post) => {
      if (post._id == req.params.postId) {
        post.likes++;
      } else {
        return `The post id "${req.params.postId}" does not exist.`;
      }
    });

    await user.save();
    return res.send(user);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

//put for post dislikes
router.put("/:userId/:postId/dislikes", auth, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.userId);
    if (!user) return res.status(400).send(`The user id "${req.params.userId}" does not exist.`);

    user.posts.filter((post) => {
      if (post._id == req.params.postId) {
        post.dislikes++;
      } else {
        return `The post id "${req.params.postId}" does not exist.`;
      }
    });

    await user.save();
    return res.send(user);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

// delete a post
router.put("/:userId/:postId", auth, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.userId);
    if (!user) return res.status(400).send(`The post id "${req.params.userId}" does not exist.`);

    const filteredPosts = user.posts.filter((post) => post._id === req.params.postId);
    user.posts = filteredPosts;

    await user.save();
    return res.send(user);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

module.exports = router;
