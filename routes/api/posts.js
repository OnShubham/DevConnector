const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const auth = require("../../middleware/auth");

const Post = require("../../models/Post");
const User = require("../../models/User");
const Profile = require("../../models/Profile");

// @route   Post api/posts
// @desc    Create Post
// @access  Public

router.post(
  "/",
  [auth, [check("text", "Text is required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select("-password");

      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      });

      const post = await newPost.save(); //save to db
      res.json(post); //return post
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route   get api/posts
// @desc    Get all posts
// @access  Private

router.get("/", auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 }); //most recent first
    res.json(posts); //return post
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   get api/posts/:id
// @desc    Get all by ID
// @access  Private

router.get("/:id", auth, async (req, res) => {
  try {
    const posts = await Post.findById(req.params.id);

    if (!posts) {
      return res.status(404).json({ msg: "Post not found" });
    }
    res.json(posts); //return post
  } catch (err) {
    console.error(err.message);

    if (err.kind == "ObjectId") {
      return res.status(404).json({ msg: "Post not found" });
    }

    res.status(500).send("Server Error");
  }
});

// @route   DELET api/posts:ID
// @desc    DELETE all posts
// @access  Private

router.delete("/:id", auth, async (req, res) => {
  try {
    const posts = await Post.findById(req.params.id);

    if (err.kind == "ObjectId") {
      return res.status(404).json({ msg: "Post not found" });
    }

    //check user
    if (posts.user.toString() !== req.user.id) {
      return res.status(404).json({ msg: "Post not found" });
    }

    await posts.remove(); //remove post

    res.json({ msg: "Post Removed" }); //return post
  } catch (err) {
    console.error(err.message);

    if (err.kind == "ObjectId") {
      return res.status(404).json({ msg: "Post not found" });
    }

    res.status(500).send("Server Error");
  }
});

// @route   Post api/posts/like:id
// @desc    Like Post
// @access  Private

router.put("/like/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // Check if the post has already been liked

    if (
      post.likes.filter((like) => like.user.toString() === req.user.id).length >
      0
    ) {
      return res.status(400).json({ msg: "Post already liked" });
    }

    post.likes.unshift({ user: req.user.id }); //add user to likes array

    await post.save(); //save to db

    res.json(post.likes); //return post
  } catch (err) {
    console.error(err.message);
    res.status(500).send("server Error");
  }
});

// @route   Post api/posts/unlike:id
// @desc    unLike Post
// @access  Private

router.put("/unlike/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // Check if the post has already been unliked

    if (
      post.likes.filter((like) => like.user.toString() === req.user.id)
        .length === 0
    ) {
      return res.status(400).json({ msg: "Post had not yet been liked" });
    }

    // Get remove index
    const removeIndex = post.likes
      .map((like) => like.user.toString())
      .indexOf(req.user.id);

    post.likes.splice(removeIndex, 1); //remove user to likes array

    await post.save(); //save to db

    res.json(post.likes); //return post
  } catch (err) {
    console.error(err.message);
    res.status(500).send("server Error");
  }
});

module.exports = router;
