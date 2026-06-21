const express = require('express');
const { authenticateToken, attachUser } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const { requestLab, getLabRequests, updateLabResult } = require('../controllers/labController');
const router = express.Router();
router.use(authenticateToken, attachUser);

router.post('/', authorizeRoles('Doctor'), requestLab);
router.get('/', authorizeRoles('Super Admin', 'Hospital Admin', 'Doctor', 'Laboratory Staff', 'Nurse'), getLabRequests);
router.put('/:id/result', authorizeRoles('Laboratory Staff'), updateLabResult);

module.exports = router;
