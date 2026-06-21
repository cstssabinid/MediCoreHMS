const express = require('express');
const { authenticateToken, attachUser } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const { getAuditLogs } = require('../controllers/auditController');
const router = express.Router();
router.use(authenticateToken, attachUser);
router.get('/', authorizeRoles('Super Admin', 'Hospital Admin'), getAuditLogs);
module.exports = router;
