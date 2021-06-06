const { User, validateUser } = require("../models/user");
const {
  Friend,
  validateFriend,
  FriendRequest,
  validateFriendRequest,
} = require("../models/friend");
const { Photo } = require("../models/photo");
const bcrypt = require("bcrypt");
const auth = require("../middleware/auth");
const express = require("express");
const router = express.Router();
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

//get all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    return res.send(users);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

//get a user
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    return res.send(user);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

//get friends list
router.get("/:id/friends", auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(400).send(`The user id ${req.params.id} does not exist.`);

    return res.send(user.friends);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

//get list of pending friend requests
router.get("/:id/friendRequests", auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(400).send(`The user id ${req.params.id} does not exist.`);

    return res.send(user.friendRequests);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

//get the photo
router.get("/:id/photo", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user)
    return res.status(400).send(`The user id ${req.params.id} does not exist.`);

    Image.findOne({}, function (err, img){
      if (err)
        res.send(err);

        console.log(img);
        res.contentType('json');
        res.send(img);
    });
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

//post a new photo
router.post("/:id/uploadPhoto", upload.single("photo"), async (req, res) => {
  try {
    let user = await User.findById(req.params.id);
    if (!user) return res.status(400).send(`The user id ${req.params.id} does not exist.`);
   
    const photoUpload = new Photo({
      photoImage: req.file.filename,
    });

    user.photoImage.push(photoUpload);
    await user.save();
    return res.send(user.photoImage);
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
    console.log(JSON.stringify(req.file));

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

    const { password, ...sendUser } = user._doc;

    const token = user.generateAuthToken();

    return res
      .header("x-auth-token", token)
      .header("access-control-expose-headers", "x-auth-token")
      .send(sendUser);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

//put -- update a user's credentials
router.put("/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(400).send(`The user id "${req.params.userId}" does not exist.`);
    console.log(user);

    if (req.body.firstName != null) {
      user.firstName = req.body.firstName;
    }
    if (req.body.lastName != null) {
      user.lastName = req.body.lastName;
    }
    if (req.body.favoriteArtist != null) {
      user.favoriteArtist = req.body.favoriteArtist;
    }
    if (req.body.favoriteAlbum != null) {
      user.favoriteAlbum = req.body.favoriteAlbum;
    }
    if (req.body.favoriteSong != null) {
      user.favoriteSong = req.body.favoriteSong;
    }

    await user.save();
    return res.send(user);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

// send a friend request
router.post("/:userId/friends/:friendId/", auth, async (req, res) => {
  try {
    const sender = await User.findById(req.params.userId);
    if (!sender) return res.status(400).send(`The user id "${req.params.userId}" does not exist.`);

    const receiver = await User.findById(req.params.friendId);
    if (!receiver)
      return res.status(400).send(`The friend user id "${req.params.friendId}" does not exist.`);

    let { error } = validateFriend({
      user_id: receiver._id,
      name: `${receiver.firstName} ${receiver.lastName}`,
    });

    if (error) return res.status(400).send(error);

    const newFriend = new Friend({
      user_id: receiver._id,
      name: `${receiver.firstName} ${receiver.lastName}`,
    });

    sender.friends.push(newFriend);

    await sender.save();

    let { err } = validateFriendRequest({
      user_id: sender._id,
      name: `${sender.firstName} ${sender.lastName}`,
    });

    if (err) return res.status(400).send(err);

    const inboundFriendRequest = new FriendRequest({
      user_id: sender._id,
      name: `${sender.firstName} ${sender.lastName}`,
    });

    receiver.friendRequests.push(inboundFriendRequest);

    await receiver.save();

    return res.send([sender, receiver]);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

//post friend
router.post("/:userId/:friendId/addFriend", auth, async (req, res) => {
  try{
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(400).send(`The user id "${req.params.userId}" does not exist.`);

    const accepted = await User.findById(req.params.friendId);
    if (!accepted) return res.status(400).send(`The user id "${req.params.friendId} does not exist.`);

    const newFriend = new Friend({
      user_id: accepted._id,
      name: `${accepted.firstName} ${accepted.lastName}`,
      pending: false
    });

    user.friends.push(newFriend);
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
