// // routes/tweets.js

const express = require('express');
const router = express.Router();
const tweetController = require('../controllers/tweetController');
const {authMiddleware} = require('../middlewares/authMiddleware');
const {validateTweet} = require('../middlewares/validateTweet');

router.get('/', authMiddleware, tweetController.getTimeline);
router.post('/', authMiddleware,validateTweet, tweetController.createTweet);

// router.get('/:tweetId', tweetController.getTweet);
// router.delete('/:tweetId', authMiddleware, tweetController.deleteTweet);
router.post('/:tweetId/like', authMiddleware, tweetController.likeTweet);
// router.delete('/:tweetId/like', authMiddleware, tweetController.unlikeTweet);
router.post('/:tweetId/retweet', authMiddleware, tweetController.retweetTweet);
// router.get('/:tweetId/replies', tweetController.getReplies);
// router.get('/explore', tweetController.getTrendingTweets);
// router.get('/search', tweetController.searchTweets);

module.exports = router;
