const express = require('express');
const { authenticateToken, attachUser } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const { getMedicines, updateStock, dispenseMedication } = require('../controllers/pharmacyController');
const router = express.Router();
router.use(authenticateToken, attachUser);

router.get('/stock', authorizeRoles('Super Admin', 'Hospital Admin', 'Pharmacist'), getMedicines);
router.put('/stock/:id', authorizeRoles('Super Admin', 'Hospital Admin', 'Pharmacist'), updateStock);
router.post('/dispense', authorizeRoles('Pharmacist'), dispenseMedication);

module.exports = router;
