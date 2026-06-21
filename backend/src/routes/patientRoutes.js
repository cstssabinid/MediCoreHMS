const express = require('express');
const { authenticateToken, attachUser } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const {
  createPatient,
  getPatients,
  getPatientById,
  updatePatient,
  searchPatients
} = require('../controllers/patientController');

const router = express.Router();
router.use(authenticateToken, attachUser);

router.post('/', authorizeRoles('Super Admin', 'Hospital Admin', 'Receptionist'), createPatient);
router.get('/', authorizeRoles('Super Admin', 'Hospital Admin', 'Receptionist', 'Doctor', 'Nurse', 'Cashier'), getPatients);
router.get('/search', authorizeRoles('Super Admin', 'Hospital Admin', 'Receptionist', 'Doctor', 'Nurse', 'Cashier'), searchPatients);
router.get('/:id', authorizeRoles('Super Admin', 'Hospital Admin', 'Receptionist', 'Doctor', 'Nurse', 'Cashier'), getPatientById);
router.put('/:id', authorizeRoles('Super Admin', 'Hospital Admin', 'Receptionist', 'Doctor', 'Nurse'), updatePatient);

module.exports = router;
