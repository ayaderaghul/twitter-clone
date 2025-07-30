console.log('📣 routes/index loaded!');

const express = require('express')
const usersRoutes = require('./users')
const authRoutes = require('./auth')
const tweetsRoutes = require('./tweets')
const router = express.Router()

router.use('/users', usersRoutes)
router.use('/auth', authRoutes)
router.use('/tweets', tweetsRoutes)
module.exports = router