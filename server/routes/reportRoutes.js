const express = require('express');
const router = express.Router();
const {
  createReport,
  getReports,
  getMyReports,
  getReportById,
  checkDuplicates,
  getNearbyReports,
  upvoteReport,
} = require('../controllers/reportController');
const { createReportValidation } = require('../validators/reportValidator');
const { protect } = require('../middleware/authMiddleware');

// Specific routes before :id
router.get('/nearby', getNearbyReports);
router.get('/duplicates', checkDuplicates);
router.get('/my', protect, getMyReports);

router.route('/')
  .get(getReports)
  .post(protect, createReportValidation, createReport);

router.route('/:id')
  .get(getReportById);

router.post('/:id/upvote', protect, upvoteReport);

module.exports = router;
