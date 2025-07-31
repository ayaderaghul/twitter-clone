const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose')

exports.getCurrentUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id)
        .select('-password')
        .populate({
                path: 'followers',
                select: 'username'
            })
            .populate({
                path: 'following',
                select: 'username'
            });
        if (!user) {
            return res.status(404).json({error: 'user not found'})
        }
        res.json(user)
    } catch(error){
        res.status(500).json({error: error.message})
    }
}

exports.getOtherUser = async (req, res, next) => {
    const userId = req.params.userId;
    // Validate the userId format first
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }
    try {
        console.log('inside trycatch getotheruser', userId)
        // 2. Find the user with proper population and null checks
    const user = await User.findById(userId)
      .select('-password') // Exclude sensitive data
      .populate({
        path: 'followers',
        select: 'username _id',
        options: { lean: true } // Return plain JS objects
      })
      .populate({
        path: 'following',
        select: 'username _id',
        options: { lean: true }
      })
      .lean(); // Convert to plain JS object

    console.log('Found user:', user ? 'exists' : 'null');

    // 3. Handle null user case
    if (!user) {
      console.log('User not found with ID:', userId);
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }
        console.log('user populated', user)
        
        // Filter out any null values
    user.followers = user.followers?.filter(f => f !== null) || [];
    user.following = user.following?.filter(f => f !== null) || [];

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'An error occurred while fetching the user' });
    }
}

exports.followUser = async (req, res, next) => {
    console.log('req',req.body, req.params)
    const followerId = req.body.currentUserId
    const targetUserId = req.params.userId;
    console.log('Current User ID:', followerId);
    console.log('Target User ID:', targetUserId);
    try {
        if (followerId === targetUserId) {
            return res.status(400).json({error: 'You cant follow yourself'})
        }
        const follower = await User.findById(followerId)
        const targetUser = await User.findById(targetUserId)
        console.log('follower, targetuser', follower, targetUser)

        if (!targetUser) {
            return res.status(404).json({error: 'target user not found'})
        }

        if (targetUser.followers.includes(followerId)) {
            return res.status(400).json({error: 'you already follow this person'})
        }

        targetUser.followers.push(followerId)
        await targetUser.save()

        follower.following.push(targetUserId)
        await follower.save()

        res.status(200).json({
            success: true,
            message: `You are now following ${targetUser.username}`,
        })
    } catch (error) {
        console.log('follow error', error)
        res.status(500).json({error: 'an error occured trying to follow'})
    }
}

exports.unfollowUser = async (req, res, next) => {
    const {userId} = req.params
    const currentUserId = req.body.currentUserId
    console.log('currentUserId', currentUserId)
    if (userId === currentUserId.toString()) {
        res.status(400)
        throw new Error('You cannot unfollow yourself')
    }

    const userToUnfollow = await User.findById(userId)
    const currentUser = await User.findById(currentUserId)

    if (!userToUnfollow || !currentUser) {
        res.status(404)
        throw new Error('User not found')
    }

    if (!currentUser.following.includes(userId)) {
        res.status(400)
        throw new Error('you arent following this user')
    }

    await User.findByIdAndUpdate(currentUserId, {
        $pull: { following: userId }
    })

    await User.findByIdAndUpdate(userId, {
        $pull: { followers: currentUserId}
    })

    res.status(200).json({
        success: true,
        message: `You have unfollowed ${userToUnfollow.username}`
    })
}



exports.whoToFollow = async (req, res, next) => {
    try {
        const suggestions = await User.find({_id: { $ne: req.user.id }})
            .sort({followersCount: -1})
            .limit(5)
            .select('_id username profilePicture followersCount')

        res.json(suggestions)
    } catch (error) {
        res.status(500).json({error: 'server error'})
    }
}