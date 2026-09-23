const express = require('express');
const router = express.Router();
const {
  getAdminDashboardMetrics,
  getAdminAnalytics,
  updateReportStatus,
  assignReport,
  getOfficers,
} = require('../controllers/adminController');
const { statusUpdateValidation } = require('../validators/reportValidator');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// Enforce authentication AND server-side Admin authorization
router.use(protect);
router.use(authorize('ADMIN'));

router.get('/dashboard', getAdminDashboardMetrics);
router.get('/analytics', getAdminAnalytics);
router.get('/officers', getOfficers);

router.patch('/reports/:id/status', statusUpdateValidation, updateReportStatus);
router.patch('/reports/:id/assign', assignReport);

module.exports = router;
