import Comment from "../models/comments.model.js";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";

export const activeCheck = async (req, res) => {
  try {
    return res.status(200).json({ message: "RUNNING" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createPost = async (req, res) => {
  const { token } = req.body;

  try {
    const user = await User.findOne({ token: token });

    if (!user) {
      return res.status(404).json({ message: "User mot found" });
    }

    const post = new Post({
      userId: user._id,
      body: req.body.body,
      media: req.file != undefined ? req.file.filename : "",
      fileType: req.file != undefined ? req.file.mimetype.split("/")[1] : "",
    });

    await post.save();

    return res.status(200).json({ message: "Post Created" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate(
      "userId",
      "name username email profilePicture"
    );

    const postsWithCount = await Promise.all(
      posts.map(async (post) => {
        const count = await Comment.countDocuments({ postId: post._id });
        return { ...post._doc, commentCount: count };
      })
    );
    
    return res.json({ posts: postsWithCount });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deletePost = async (req, res) => {
  const { token, post_id } = req.body;

  try {
    const user = await User.findOne({ token: token }).select("_id");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const post = await Post.findOne({ _id: post_id });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.userId.toString() !== user._id.toString()) {
      return res.status(401).json({ message: " Unauthorized" });
    }

    await Post.deleteOne({ _id: post_id });

    return res.json({ message: "Post Deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const get_comments_by_post = async (req, res) => {
  const { post_id } = req.body;

  console.log(`post Id: ${post_id}`)

  try {
    const post = await Post.findOne({ _id: post_id });

    console.log(post)

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comments = await Comment
    .find({ postId: post_id })
    .populate("userId", "username name");

    return res.json( comments.reverse() );

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const delete_comment_of_user = async (req, res) => {
  const { token, comment_id } = req.body;

  try {
    const user = await user.findOne({ token: token }).select("_id");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const comment = await Comment.findOne({ _id: comment_id });

    if (!comment) {
      return req.status(404).json({ message: "Comment not found" });
    }

    if (comment.userId.toString() !== user._id.toString()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    await Comment.deleteOne({ _id: comment_id });

    return res.json({ message: "Comment Deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const increment_likes = async (req, res) => {
  try {
    const { post_id, user_id } = req.body;

    const post = await Post.findById(post_id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // 🛑 safe check
    if (!Array.isArray(post.likes)) {
      post.likes = [];
    }

    if (post.likes.includes(user_id)) {
      // 🔹 Unlike
      post.likes = post.likes.filter(
        (id) => id.toString() !== user_id.toString()
      );
    } else {
      // 🔹 Like
      post.likes.push(user_id);
    }

    await post.save();

    return res.json({
      message: post.likes.includes(user_id) ? "Liked" : "Unliked",
      post_id: post._id,
      likes: post.likes.length,   // 👈 frontend ke liye count
      likedBy: post.likes,        // 👈 optional: konsi users ne like kiya
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};