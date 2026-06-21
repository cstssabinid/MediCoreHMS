const express = require('express');
const { authenticateToken, attachUser } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  getTodayAppointments
} = require('../controllers/appointmentController');

const router = express.Router();
router.use(authenticateToken, attachUser);

router.post('/', authorizeRoles('Super Admin', 'Hospital Admin', 'Receptionist'), createAppointment);
router.get('/', authorizeRoles('Super Admin', 'Hospital Admin', 'Receptionist', 'Doctor', 'Nurse'), getAppointments);
router.get('/today', authorizeRoles('Super Admin', 'Hospital Admin', 'Receptionist', 'Doctor', 'Nurse'), getTodayAppointments);
router.get('/:id', authorizeRoles('Super Admin', 'Hospital Admin', 'Receptionist', 'Doctor', 'Nurse'), getAppointmentById);
router.put('/:id', authorizeRoles('Super Admin', 'Hospital Admin', 'Receptionist', 'Doctor', 'Nurse'), updateAppointment);

module.exports = router;
