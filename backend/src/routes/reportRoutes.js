const express = require('express');
const { authenticateToken, attachUser } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const { getReports } = require('../controllers/reportController');
const router = express.Router();
router.use(authenticateToken, attachUser);
router.get('/', authorizeRoles('Super Admin', 'Hospital Admin'), getReports);
module.exports = router;
