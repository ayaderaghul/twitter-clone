const mongoose = require('mongoose');
const { Schema } = mongoose;
const User = require('./User'); // Assuming User model is in the same directory


const tweetSchema = new Schema({
    content: {
        type: String,
        required: [true, "Content is required"],
        maxlength: [280, "Content must be less than 280 characters"],
        trim: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "Author is required"]
    },
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    likeCount: {
        type: Number,
        default: 0
    },
    retweets: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    retweetCount: {
        type: Number,
        default: 0
    },
    replies: [{
        type: Schema.Types.ObjectId,
        ref: 'Tweet'
    }],
    replyCount: {
        type: Number,
        default: 0 
    },
    replyTo: {
        type: Schema.Types.ObjectId,
        ref: 'Tweet'
    },
    replyToTweet: {
        type: Schema.Types.ObjectId,
        ref: 'Tweet'
    },
    isRetweet: {
        type: Boolean,
        default: false
    },
    originalTweet: {
        type: Schema.Types.ObjectId,
        ref: 'Tweet'
    },
    retweetedBy: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    views: {
        type: Number,
        default: 0  
    },
    hashtags: [{
        type: String,
        trim: true
    }],
    mentions: [{
    username: {
      type: String,
      required: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  }],
    media: [{
        url: String,
        mediaType: {
            type: String,
            enum: ['image', 'video', 'gif']
        }
    }],
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt fields     
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// self update counts
tweetSchema.pre('save', function(next){
    if (this.isModified('likes')) {
        this.likeCount = this.likes.length
    }
    if (this.isModified('retweets')) {
        this.retweetCount = this.retweets.length
    }
    if (this.isModified('replies')) {
        this.replyCount = this.replies.length
    }
    next();
})

// automatically extract hashtags and mentions before save
tweetSchema.pre('save', async function(next){
    this.hashtags = [...new Set(
        this.content.match(/#\w+/g)?.map(tag => tag.substring(1).toLowerCase()) || []
    )]

    const mentions = this.content.match(/@\w+/g)?.map(mention => mention.substring(1)) || []
    const userIds = await Promise.all(
        mentions.map(async (mention) => {
            const user = await User.findOne({ username: mention });
            return user?.id;
        })
        ); 
})


// like
tweetSchema.methods.like = async function(userId) {
    if (this.likes.includes(userId)) {
        throw new Error('you already like this tweet')
    }

    this.likes.push(userId)
    await this.save()
}

tweetSchema.methods.unlike = async function(userId) {
    if (!this.likes.includes(userId)) {
        throw new Error('you havent liked this tweet')
    }

    this.likes.filter(item => item !== userId)
    await this.save()
}

// retweet

tweetSchema.methods.retweet = async function (userId) {
    if (this.retweets.includes(userId)) {
        throw new Error ('you already retweeted this')
    }

    this.retweet.push(userId)
    await this.save()

    const retweet = await Tweet.create({
        content: this.content,
        author: userId,
        isRetweet: true,
        originalTweet: this._id,
    })
    return retweet
}

tweetSchema.methods.addReply = async function(userId, content) {
    const reply = await Tweet.create({
        content,
        author: userId,
        replyTo: this._id,
    })
    this.replies.push(reply._id)
    await this.save()
    return reply
}

// Thêm vào schema
tweetSchema.virtual('authorInfo', {
  ref: 'User',
  localField: 'author',
  foreignField: '_id',
  justOne: true,
  options: { select: 'username name profilePicture' }
});

tweetSchema.virtual('originalTweetInfo', {
  ref: 'Tweet',
  localField: 'originalTweet',
  foreignField: '_id',
  justOne: true
});

tweetSchema.virtual('parentTweetInfo', {
  ref: 'Tweet',
  localField: 'replyTo',
  foreignField: '_id',
  justOne: true
});

tweetSchema.methods.toJSON = function() {
  const tweet = this.toObject();
  
  // Chuyển đổi dữ liệu trước khi trả về client
  return {
    id: tweet._id,
    content: tweet.content,
    author: tweet.author,
    createdAt: tweet.createdAt,
    updatedAt: tweet.updatedAt,
    likes: tweet.likes,
    likeCount: tweet.likeCount,
    retweets: tweet.retweets,
    retweetCount: tweet.retweetCount,
    replies: tweet.replies,
    replyCount: tweet.replyCount,
    views: tweet.views,
    isRetweet: tweet.isRetweet,
    originalTweet: tweet.originalTweetInfo,
    replyTo: tweet.parentTweetInfo,
    hashtags: tweet.hashtags,
    mentions: tweet.mentions,
    media: tweet.media
  };
};

// index

tweetSchema.index({ author: 1, createdAt: -1 });

tweetSchema.index({ likeCount: -1, retweetCount: -1, createdAt: -1 });

tweetSchema.index({ hashtags: 1, createdAt: -1 });

tweetSchema.index({ replyTo: 1, createdAt: 1 });

const Tweet = mongoose.model('Tweet', tweetSchema)
module.exports = Tweet