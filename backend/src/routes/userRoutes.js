const express = require('express');
const { authenticateToken, attachUser } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const { listUsers, createUser, updateUser, getUserActivity } = require('../controllers/userController');
const router = express.Router();
router.use(authenticateToken, attachUser);

router.get('/', authorizeRoles('Super Admin', 'Hospital Admin'), listUsers);
router.post('/', authorizeRoles('Super Admin', 'Hospital Admin'), createUser);
router.put('/:id', authorizeRoles('Super Admin', 'Hospital Admin'), updateUser);
router.get('/:id/activity', authorizeRoles('Super Admin', 'Hospital Admin'), getUserActivity);

module.exports = router;
