const express = require('express');
const { authenticateToken, attachUser } = require('../middleware/authMiddleware');
const publicController = require('../controllers/publicController');

const router = express.Router();

router.get('/departments', publicController.listDepartments);
router.get('/locations', publicController.listLocations);
router.get('/doctors', publicController.listDoctors);
router.get('/doctors/:id', publicController.getDoctor);
router.post('/appointments', publicController.createPublicAppointment);
router.post('/online', publicController.createOnlineConsultation);
router.post('/inquiries', publicController.createInquiry);
router.get('/blog', publicController.listPosts);
router.get('/blog/:slug', publicController.getPost);

module.exports = router;
