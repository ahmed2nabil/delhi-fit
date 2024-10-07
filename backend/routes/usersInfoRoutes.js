// routes/recordRoutes.js
const express = require('express');
const { getUsersInfo, AddUserInfo } = require('../controllers/usersInfoController');
const auth = require('../middleware/auth');
const router = express.Router();

// Protect the route with auth middleware
router.get('/', getUsersInfo);

router.post('/', AddUserInfo);
module.exports = router;
