const {analyzeTrends} = require('../utils/trendAnalyzer')
const Tweet = require('../models/Tweet')

exports.getWeeklyTrend = async (req,res) => {
    const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    const tweets = await Tweet.find({createdAt: {$gte: lastWeek}})
    const trends = analyzeTrends(tweets)
    res.json({trends})
}