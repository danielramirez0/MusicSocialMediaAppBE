// const { Comment, Reply, validateComment, validateReply } = require ('../models/comment');
const { User, validateUser } = require("../models/user");
const { Post, validatePost } = require("../models/post");
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
    if (user)
    return res.status(400).send("User already registered");

    user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
      favoriteArtist: req.body.favoriteArtist,
      favoriteAlbum: req.body.favoriteAlbum,
      favoriteSong: req.body.favoriteSong
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

//post a new post
router.post("/:id/post", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(400).send(`The user id "${req.params.id}" does not exist.`);

    const {error} = validatePost(req.body)
    if (error)
    return res.status(400).send(error);

    const post = new Post ({
      body: req.body.body,
    });

    user.posts.push(post);
    await user.save();

    return res.send(user.posts);
  } catch (ex){
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

//put for post likes
router.put("/:userId/:postId/likes", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.userId);
    if (!user) return res.status(400).send(`The user id "${req.params.userId}" does not exist.`);

    user.posts.filter((post) => {
      if (post._id == req.params.postId){
        post.likes ++;
      }else {
        return (`The post id "${req.params.postId}" does not exist.`);
      }
    })

    await user.save();
    return res.send(user);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

//put for post dislikes
router.put("/:userId/:postId/dislikes", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.userId);
    if (!user) return res.status(400).send(`The user id "${req.params.userId}" does not exist.`);

    user.posts.filter((post) => {
      if (post._id == req.params.postId){
        post.dislikes ++;
      }else {
        return (`The post id "${req.params.postId}" does not exist.`);
      }
    })

    await user.save();
    return res.send(user);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

//post user
router.delete("/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndRemove(req.params.id);

    if (!user)
    return res.status(400).send(`The user id "${req.params.id}" does not exist.`);
    
    return res.send(user);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

//delete post
router.put("/:userId/:postId", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.userId);
    if (!user) return res.status(400).send(`The post id "${req.params.userId}" does not exist.`);

    const tempPost = user.posts.filter((post) => post._id === req.params.postId);
    user.posts = tempPost;

    await user.save();
    return res.send(user);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

module.exports = router;
