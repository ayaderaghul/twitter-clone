const Tweet = require('../models/Tweet');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const mongoose = require('mongoose')
const {extractMentions, validateMentions, formatMentionData} = require('../utils/mentionParser')
const { getIo, sendNotification } = require('../services/socketService');


exports.getTimeline = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).populate('following');
        console.log('User ID:', userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const followingIds = user.following.map(follow => follow._id);
        followingIds.push(userId); // Include the user's own tweets

        const tweets = await Tweet.find({ author: { $in: followingIds } })
            .sort({ createdAt: -1 })
            .populate('author', 'username name')
            .populate({
                path: 'originalTweet',
                populate: {
                path: 'author',
                select: 'username avatar' // you can include more fields if needed
                }
            });

        res.status(200).json(tweets);
    } catch (error) {
        console.error('Error fetching timeline:', error);
        res.status(500).json({ error: 'An error occurred while fetching the timeline' });
    }
}
exports.createTweet = async (req, res) => {
    try {
        const { content } = req.body;
        if (!content) {
            return res.status(400).json({ error: 'Content is required' });
        }
        const author = req.user.id;
        if (!author) {
            return res.status(400).json({ error: 'Author is required' });
        }
        if (!req.user || !req.user.id) {
            return res.status(401).json({ error: 'Unauthorized: no user info' });
        }

        const userExists = await User.findById(author);
        if (!userExists) return res.status(400).json({ error: 'Author not found.' });

        try {
            const mentionedUsernames = extractMentions(content)
            console.log('extracted mentions', mentionedUsernames)

            const {valid: validMentions} = await validateMentions(mentionedUsernames)
            console.log('valid mentions', validMentions)

            const mentions = await formatMentionData(validMentions)
            console.log('formated mentions', mentions)



            const tweet = await Tweet.create({ content, author,
                mentions: mentions.map(mention => ({
                    username: mention.username,
                    userId: mention.userId
                }))
             });

             const populatedTweet = await Tweet.findById(tweet._id)
                .populate('author', 'username')
                .populate('mentions.userId', 'username');
             console.log(populatedTweet)
               res.status(201).json(populatedTweet);
            // await tweet.save()
            // res.status(201).json(tweet);
            } catch (error) {
            console.error('Tweet creation error:', error);
            console.log('error', error.message);
            res.status(500).json({ error: 'Failed to create tweet.' });
            }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while creating the tweet' });
    }
}

exports.likeTweet = async (req, res) => {
    try {
        const { tweetId } = req.params;
        const userId = req.user.id;
        console.log('userid inside liketweet', req.user)
        // Enhanced ID validation
        if (!mongoose.Types.ObjectId.isValid(tweetId)) {
            return res.status(400).json({ 
                error: 'Invalid tweet ID format',
                receivedId: tweetId
            });
        }

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ 
                error: 'Invalid user ID format',
                receivedId: userId
            });
        }

        // Convert to ObjectId for consistent comparison
        const tweetObjectId = new mongoose.Types.ObjectId(tweetId);
        const userObjectId = new mongoose.Types.ObjectId(userId);

        const tweet = await Tweet.findById(tweetObjectId);
        if (!tweet) {
            return res.status(404).json({ error: 'Tweet not found' });
        }

        // Check if already liked (using ObjectId comparison)
        const isLiked = tweet.likes.some(likeId => 
            likeId.equals(userObjectId)
        );

        // Update operation
        const updateOperation = isLiked 
            ? { $pull: { likes: userObjectId } }
            : { $addToSet: { likes: userObjectId } };

        const updatedTweet = await Tweet.findByIdAndUpdate(
            tweetObjectId,
            updateOperation,
            { new: true }
        ).populate('author', 'username avatar');
        updatedTweet.likeCount = updatedTweet.likes.length
        await updatedTweet.save()

// Send notification if this was a new like (not an unlike)
        if (!isLiked && !tweet.author._id.equals(userObjectId)) {
            try {
                await sendNotification(tweet.author._id, {
                    type: 'like',
                    sender: userId,
                    tweet: tweet._id
                });
                console.log('Notification sent for like');
            } catch (notifError) {
                console.error('Failed to send notification:', notifError);
                // Don't fail the request if notification fails
            }
        }

        // Emit real-time update via Socket.IO
        const io = getIo();
        if (io) {
            io.emit('tweetUpdate', {
                tweetId: updatedTweet._id,
                likeCount: updatedTweet.likes.length,
                action: isLiked ? 'unlike' : 'like',
                userId
            });
        }




        return res.json({
            success: true,
            tweetId: updatedTweet._id,
            likeCount: updatedTweet.likes.length,
            isLiked: !isLiked
        });

    } catch (error) {
        console.error('Like error:', error);
        return res.status(500).json({ 
            error: 'Server error',
            details: error.message 
        });
    }
};

exports.retweetTweet = async (req, res) => {
    try {
        const { tweetId } = req.params
        const userId = req.user.id
        
        console.log('user inside retweet', req.user)

        if (!mongoose.Types.ObjectId.isValid(tweetId)) {
            return res.status(400).json({
                error: 'invalid tweet ID format',
                receivedId: tweetId
            })
        }

        if(!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                error: 'invalid user id format',
                receivedId: userId
            })
        }

        const originalTweet = await Tweet.findById(tweetId)
        if (!originalTweet) {
            return res.status(404).json({error: 'original tweet not found'})
        }

        const existingRetweet = await Tweet.findOne({
            author: userId,
            isRetweet: true,
            originalTweet: tweetId
        })

        if (existingRetweet) {
            // toggle off
            await Tweet.findByIdAndDelete(existingRetweet._id)
            originalTweet.retweets = originalTweet.retweets.filter(u => u.toString() !== userId.toString())
            await originalTweet.save()
            console.log('original retweet count', originalTweet.retweetCount)
            return res.json({
                success: true,
                retweetRemoved: true,
                retweetCount: originalTweet.retweetCount,
                tweetId: tweetId
            })
        } else {
            const retweet = await Tweet.create({
                content: originalTweet.content,
                author: userId,
                isRetweet: true,
                originalTweet: originalTweet.id
            })

            console.log('original tweet', retweet.originalTweet)

            originalTweet.retweets.push(userId)
            await originalTweet.save()

            return res.json({
                success: true,
                retweetCreated: true,
                retweetTweetId: retweet._id,
                retweetCount: originalTweet.retweetCount,
                tweetId: tweetId
            })
        } 
        }catch (error) {
            console.error('retweet error', error)
            return res.status(500).json({error: 'server error',details: error.message})
        }
    }