const express = require('express');
const { login, profile } = require('../controllers/authController');
const { authenticateToken, attachUser } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/login', login);
router.get('/profile', authenticateToken, attachUser, profile);

module.exports = router;
