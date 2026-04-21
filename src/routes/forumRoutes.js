const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  createPost,
  getPosts,
  addReply,
  upvotePost
} = require('../controllers/forumController');

router.post('/', auth, createPost);
router.get('/', getPosts);
router.post('/:id/reply', auth, addReply);
router.put('/:id/upvote', auth, upvotePost);

module.exports = router;