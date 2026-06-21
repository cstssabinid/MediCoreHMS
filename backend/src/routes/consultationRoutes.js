const express = require('express');
const { authenticateToken, attachUser } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const { createConsultation, getConsultations, getConsultationById } = require('../controllers/consultationController');
const router = express.Router();
router.use(authenticateToken, attachUser);

router.post('/', authorizeRoles('Doctor'), createConsultation);
router.get('/', authorizeRoles('Super Admin', 'Hospital Admin', 'Doctor', 'Nurse'), getConsultations);
router.get('/:id', authorizeRoles('Super Admin', 'Hospital Admin', 'Doctor', 'Nurse'), getConsultationById);

module.exports = router;
