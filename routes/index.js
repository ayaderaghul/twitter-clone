
const express = require('express')
const usersRoutes = require('./users')
const authRoutes = require('./auth')
const tweetsRoutes = require('./tweets')
const notificationRoutes = require('./notifications')
const trendRoutes = require('./trends')

const router = express.Router()

router.use('/users', usersRoutes)
router.use('/auth', authRoutes)
router.use('/tweets', tweetsRoutes)
router.use('/notifications', notificationRoutes)
router.use('/trends', trendRoutes)

module.exports = router