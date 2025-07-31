const User = require('../models/User')

function extractMentions(text) {
    if (!text || typeof text !== 'string') return []
    const mentionRegex = /@([a-zA-Z0-9_]+)/g
    const matches = [...text.match(mentionRegex)]

    return [...new Set(matches.map(match => match.substring(1)))]
}

async function validateMentions(usernames) {
    if (!usernames.length) return {valid: [], invalid: []}

    const existingUsers = await User.find({
        username: { $in: usernames}
    }).select('username')

    console.log('from utils, users', existingUsers)

    const existingUsernames = existingUsers.map(u => u.username)
    return {
        valid: usernames.filter(u => existingUsernames.includes(u)),
        invalid: usernames.filter(u => !existingUsernames.includes(u))

    }
}

async function formatMentionData(usernames) {
    if (!usernames.length) return []

    const users = await User.find({
        username: { $in: usernames}

    }).select('username _id')

    return users.map(user => ({
        username: user.username,
        userId: user._id
    }))
}

module.exports = { extractMentions, validateMentions, formatMentionData}