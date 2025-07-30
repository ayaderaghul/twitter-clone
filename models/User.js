const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: true,
        trim: true,
        minlength: [3, "Username must be at least 3 characters long"],
        maxlength: [20, "Username must be at most 20 characters long"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: function(v) {
                return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
            },
            message: "Invalid email format"
        }
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters long"],
        select: false // Do not return password in queries
    },
    name: {
        type: String,
        trim: true,
        maxlength: [50, "Name must be at most 50 characters long"]
    },
    bio: {
        type: String,
        trim: true,
        maxlength: [160, "Bio must be at most 160 characters long"]
    },
    profilePicture: {
        type: String,
        default: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAJQAlAMBIgACEQEDEQH/xAAbAAEAAwEBAQEAAAAAAAAAAAAAAwQFAgEGB//EADIQAAICAQICCQMDBAMAAAAAAAABAgMEESESMQUTIjJBUVJhcRRCkYGhsTRicqIjU8H/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8A/cQAAAI7bYVRcpvRfyBIQXZVVW0pay8kUMjNst2hrCHtzZVAu2dIzb/44qPzuV5ZN8+9bL9NiIAeuTlzbb92ebgAdxtsjyskvhk0M66PN8XyVgBp1dIQltZFwftui3CcZxUotNPxRgnVdk6pcUJNMDeBTxs2NjUbOzN/hlwAAAAAAAHF1kaoOcnokBxk5EKK+KXN8o+ZkXWzulxTe/7IXWytsc5c/wCDgAAAAAAAAAAAAAAF7DzHFqu56x8JPw+SiAPoAZ+Bk8qZvf7WaAAAADJ6Qv623gi+zD92X8y3qaJSXeeyMYAAAAAAElVFlvcjqvPwLWHh8a47o9nwj5mikktEtEgM2HRs335xXxudvo1/9v8AqaAAyLMG6HJKa9is009GtH5H0BBkY1d8e0tJeElzAxgd3VSpnwT5+HucAAAATa5PR+Zs4l3XVKX3LZmMWcC3q70vtls//ANcHh6BmdJz1sjD0rUpEuVLjybH/dp+CIAAABYwaOut1fcju/f2K5rdH18GNF+MtwLKPQAAAAAACvmUddU9F21vFmOfQGNmw6vImlstdUBAAAATaeq5gAbtM+OqM/NanhX6OsX0+jfKTQAzJPik34ttngAAAADbxv6ev/FGIbODLixYey0AnAAAAAAAAMrpP+oX+JqmR0hNSyZafbsBWAAAAAT0W8EGvcEUYtrYAe3R4brF5SOCz0hDhyW/VuVgAAAF3o27hm65PaW6+SkE2mmtmgPoAVMPKVqUZvSz+S2AAAAA5nOMIuU2kkBzfYqqnN+HIxG3JuT5smy8h3z22guSIAAAAAAC9g08dLl/cC3hQ4MaC5arUAQ9J18VcZrnF6foZhvTipwcZLVNaMw7a3VNwlzTA5AAAAlhj22d2uXy1oBEW6c+yGimuNfO5z9DkehflD6HI9K/KAuRz6X3tYv3R087H9f+rKP0OR6F+UPocj0r8oCxZ0jHlXBv3lsUrrrLpa2S18kvAl+hyPSvyh9DkelflAVgTyw8iO7hqvZ6kMk4vSSafk1oB4AAB3RW7bYw9TODR6Mp0TufN7IC8uW2wPQAKfSFHWQ44Ltx8PNFwAfPnVdcrZqEFq3+xczsVxbtrXZfeS8Pcm6OVSp1i9Z/cB3j4ldSTfal5vw+CyAAAAAAAAAAOLK4WR0nFSXudgDJy8N0vjhvX+6KpvySaaa203MeVKnkuvH7S128kBzjUu+xRXd8WbUYqKSjslyRHj0RorUY7vxfmSgAAAAAAo34sq59bi7S8Yl4AVMfMjN8FnYs5aPxLZBfjV395aS9S5lfhy8buvrYLwAvgpw6Qrb4bE4SLMLa592cX8MDsAAAeNpc2l8kNmXRDnYn7LcCc4sshXHWbSRU+rtu2xqn/kxXhOcuPJm5y8lyA5lbbmvgpTjX9zLdFEKIaQW/i/MkilFaJJJeR6AAAAAAAAAAAAAAcTqrmu3BS+UVrMCjTWPFH4YAFO2DqekJzX6kanOXOcvyeAC3RiV26Obk/wBS1DDor5Vp/O56AJktNvI9AAAAAAAAAA//2Q==' // Placeholder URL
    },
    coverPhoto: {
        type: String,
    },
    location: {
        type: String,
        trim: true
    },
    website: {
        type: String,
        trim: true
    },
    birthDate: {
        type: Date
    },
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    likedTweets: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tweet'
    }],
    retweetedTweets: [{
        type: mongoose.Schema.Types.ObjectId,   
        ref: 'Tweet'
    }],
    savedTweets: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tweet'
    }],
    isVerified: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isPrivate: {
        type: Boolean,
        default: false
    },
    isSuspended: {
        type: Boolean,
        default: false
    },
    lastLogin: {
        type: Date,
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
    }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12);
    next()
});


// update updatedAt before saving
userSchema.pre('save', function(next){
    this.updatedAt = Date.now();
    next();
})

// check password
userSchema.methods.correctPassword = async function(
    candidatePassword, 
    userPassword) {
        return await bcrypt.compare(candidatePassword, userPassword)
}

// follow
userSchema.methods.follow = async function(userId) {
    if (this.following.includes(userId)) {
        throw new Error('You are already followiing this person')
    }
    this.following.push(userId)
    await this.save()

    await user.findByIdAndUdate(userId, {
        $addToSet: { followers: this._id}
    })
}

// unfollow
userSchema.methods.unfollow = async function(userId) {
    if(!this.following.includes(userId)){
        throw new Error('You havent followed this person')
    }

    this.following.filter(item => item !== userId)
    await this.save()

    await User.findByIdAndUpdate(userId, {
        $pull: { followers: this._id}
    })
}

userSchema.methods.isFollowing = function(userId) {
    return this.following.includes(userId)
}

userSchema.methods.isFollowedBy = function(userId) {
    return this.followers.includes(userId)
}

// create indexing for frequent query fields

// userSchema.index({username: 1})
// userSchema.index({email: 1})
userSchema.index({followers: 1})
userSchema.index({following: 1})

userSchema.virtual('followersCount').get(function() {
  return this.followers ? this.followers.length : 0;
});

userSchema.virtual('followingCount').get(function() {
  return this.following ? this.following.length : 0;
});

userSchema.methods.toProfileJSON = function(user) {
  return {
    _id: this._id,
    username: this.username,
    name: this.name,
    bio: this.bio,
    profilePicture: this.profilePicture,
    coverPhoto: this.coverPhoto,
    isFollowing: user ? user.isFollowing(this._id) : false,
    followersCount: this.followersCount,
    followingCount: this.followingCount
  };
};

userSchema.methods.toAuthJSON = function() {
  return {
    _id: this._id,
    username: this.username,
    email: this.email,
    name: this.name,
    profilePicture: this.profilePicture,
    isVerified: this.isVerified
  };
};


const User = mongoose.model('User', userSchema)
module.exports = User