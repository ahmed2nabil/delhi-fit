// routes/recordRoutes.js
const express = require('express');
const { getUsersInfo } = require('../controllers/usersInfoController');
const auth = require('../middleware/auth');
const router = express.Router();

// Protect the route with auth middleware
router.get('/', auth, getUsersInfo);

module.exports = router;
