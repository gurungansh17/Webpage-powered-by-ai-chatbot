const express = require('express')
const router  = express.Router()
const { chat } = require('../controllers/chatController')

// Public — no auth needed, rate limited by global limiter in server.js
router.post('/', chat)

module.exports = router
