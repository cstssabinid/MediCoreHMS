const express = require('express');
const { authenticateToken, attachUser } = require('../middleware/authMiddleware');
const controller = require('../controllers/initiativeController');

const router = express.Router();
const admin = [authenticateToken, attachUser];

router.get('/donation-campaigns', controller.listCampaigns);
router.post('/donation-campaigns', ...admin, controller.saveCampaign);
router.patch('/donation-campaigns/:id', ...admin, controller.updateCampaign);
router.post('/donations', controller.createDonation);
router.get('/donations', ...admin, controller.listDonations);
router.get('/donations/:id', ...admin, controller.getDonation);
router.patch('/donations/:id/status', ...admin, controller.updateDonationStatus);

router.post('/guidance-requests', controller.createGuidanceRequest);
router.get('/guidance-requests', ...admin, controller.listGuidanceRequests);
router.patch('/guidance-requests/:id/status', ...admin, controller.updateGuidanceStatus);

router.post('/volunteer-applications', controller.createVolunteer);
router.get('/volunteer-applications', ...admin, controller.listVolunteers);
router.patch('/volunteer-applications/:id/status', ...admin, controller.updateVolunteer);
router.post('/partner-inquiries', controller.createPartnerInquiry);
router.get('/partner-inquiries', ...admin, controller.listPartnerInquiries);
router.patch('/partner-inquiries/:id/status', ...admin, controller.updatePartner);

router.get('/stories', controller.listStories);
router.get('/stories/featured', controller.featuredStories);
router.get('/stories/founding', controller.foundingStory);
router.get('/stories/admin/all', ...admin, controller.listAllStories);
router.get('/stories/:slug', controller.getStory);
router.post('/stories', ...admin, controller.saveStory);
router.patch('/stories/:id', ...admin, controller.updateStory);
router.delete('/stories/:id', ...admin, controller.deleteStory);
router.patch('/stories/:id/publication-status', ...admin, controller.updateStory);
router.patch('/stories/:id/feature-status', ...admin, controller.updateStory);

router.get('/health-education-posts', controller.listEducation);
router.get('/health-education-posts/:slug', controller.getEducationPost);
router.post('/health-education-posts', ...admin, controller.saveEducationPost);
router.get('/impact-metrics', controller.listImpact);
router.patch('/impact-metrics/:id', ...admin, controller.updateImpact);

module.exports = router;
