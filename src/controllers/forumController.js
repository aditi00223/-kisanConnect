const ForumPost = require('../models/ForumPost');

// CREATE POST
exports.createPost = async (req, res) => {
  try {
    const { title, content } = req.body;

    const post = await ForumPost.create({
      author: req.user.id,
      title,
      content
    });

    res.status(201).json({ message: 'Post created successfully', post });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET ALL POSTS
exports.getPosts = async (req, res) => {
  try {
    const posts = await ForumPost.find()
      .populate('author', 'name role location')
      .sort({ createdAt: -1 });

    res.json({ posts });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ADD REPLY
exports.addReply = async (req, res) => {
  try {
    const { content } = req.body;

    const post = await ForumPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.replies.push({
      author: req.user.id,
      content
    });

    await post.save();

    res.json({ message: 'Reply added', post });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// UPVOTE POST
exports.upvotePost = async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const alreadyUpvoted = post.upvotes.includes(req.user.id);

    if (alreadyUpvoted) {
      // Remove upvote
      post.upvotes = post.upvotes.filter(id => id.toString() !== req.user.id);
      await post.save();
      return res.json({ message: 'Upvote removed', upvotes: post.upvotes.length });
    }

    post.upvotes.push(req.user.id);
    await post.save();

    res.json({ message: 'Post upvoted', upvotes: post.upvotes.length });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};