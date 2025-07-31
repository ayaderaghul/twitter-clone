// routes/users.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const {authMiddleware} = require('../middlewares/authMiddleware');
router.get('/me', authMiddleware, userController.getCurrentUser);
// router.patch('/me', authMiddleware, upload.single('avatar'), user--Controller.updateProfile);
// router.get('/:username', userController.getUserProfile);
// router.get('/:username/followers', userController.getFollowers);
// router.get('/:username/following', userController.getFollowing);
router.post('/:userId/follow', authMiddleware, userController.followUser);
router.post('/:userId/unfollow', authMiddleware, userController.unfollowUser);
router.get('/toFollow', authMiddleware, userController.whoToFollow)

// router.get('/suggestions', authMiddleware, userController.getSuggestions);
// router.get('/search', userController.searchUsers);
router.get('/:userId', authMiddleware, userController.getOtherUser);
module.exports = router;
