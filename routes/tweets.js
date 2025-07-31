// // routes/tweets.js

const express = require('express');
const router = express.Router();
const tweetController = require('../controllers/tweetController');
const {authMiddleware} = require('../middlewares/authMiddleware');
const {validateTweet} = require('../middlewares/validateTweet');
const upload = require('../utils/upload');
router.get('/', authMiddleware, tweetController.getTimeline);
// Verify the upload middleware exists
console.log('Upload middleware:', upload); // Debug line
console.log('Upload object:', upload);
console.log('Upload.single exists?', !!upload.single);


router.post('/', 
  authMiddleware,
  upload.single('media'),
  (req, res, next) => {
    console.log('Multer processed file:', {
      file: req.file ? {
        originalname: req.file.originalname,
        path: req.file.path,
        size: req.file.size
      } : null,
      body: req.body
    });
    next();
  },
  validateTweet,
  tweetController.createTweet
);

// router.get('/:tweetId', tweetController.getTweet);
// router.delete('/:tweetId', authMiddleware, tweetController.deleteTweet);
router.post('/:tweetId/like', authMiddleware, tweetController.likeTweet);
// router.delete('/:tweetId/like', authMiddleware, tweetController.unlikeTweet);
router.post('/:tweetId/retweet', authMiddleware, tweetController.retweetTweet);
// router.get('/:tweetId/replies', tweetController.getReplies);
// router.get('/explore', tweetController.getTrendingTweets);
// router.get('/search', tweetController.searchTweets);
// router.post('/upload', upload.single('media'), authMiddleware, tweetController.upload)
module.exports = router;
