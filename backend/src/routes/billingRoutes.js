const express = require('express');
const { authenticateToken, attachUser } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const { createInvoice, getInvoices, getInvoiceById, addPayment } = require('../controllers/billingController');
const router = express.Router();
router.use(authenticateToken, attachUser);

router.post('/', authorizeRoles('Super Admin', 'Hospital Admin', 'Cashier'), createInvoice);
router.get('/', authorizeRoles('Super Admin', 'Hospital Admin', 'Cashier'), getInvoices);
router.get('/:id', authorizeRoles('Super Admin', 'Hospital Admin', 'Cashier'), getInvoiceById);
router.post('/:id/payment', authorizeRoles('Cashier'), addPayment);

module.exports = router;
