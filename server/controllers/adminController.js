const { Op } = require('sequelize');
const { sequelize, Report, User, Notification, ReportStatusHistory } = require('../models');

// @desc    Get aggregate operational statistics for Admin Dashboard
// @route   GET /api/admin/dashboard
// @access  Private (Admin)
const getAdminDashboardMetrics = async (req, res) => {
  const [
    totalReports,
    pendingReview,
    assigned,
    inProgress,
    resolved,
    highUrgentPriority,
    recentReports,
    priorityQueue,
  ] = await Promise.all([
    Report.count(),
    Report.count({ where: { status: { [Op.in]: ['REPORTED', 'UNDER_REVIEW'] } } }),
    Report.count({ where: { status: 'ASSIGNED' } }),
    Report.count({ where: { status: 'IN_PROGRESS' } }),
    Report.count({ where: { status: 'RESOLVED' } }),
    Report.count({
      where: {
        priority: { [Op.in]: ['HIGH', 'URGENT'] },
        status: { [Op.ne]: 'RESOLVED' },
      },
    }),
    Report.findAll({
      include: [
        { model: User, as: 'reporter', attributes: ['name', 'email', 'avatar'] },
        { model: User, as: 'assignedTo', attributes: ['name', 'department'] },
      ],
      order: [['createdAt', 'DESC']],
      limit: 6,
    }),
    Report.findAll({
      where: {
        priority: { [Op.in]: ['HIGH', 'URGENT'] },
        status: { [Op.ne]: 'RESOLVED' },
      },
      include: [
        { model: User, as: 'reporter', attributes: ['name', 'email'] },
        { model: User, as: 'assignedTo', attributes: ['name', 'department'] },
      ],
      order: [['createdAt', 'DESC']],
      limit: 5,
    }),
  ]);

  res.json({
    success: true,
    data: {
      metrics: {
        totalReports,
        pendingReview,
        assigned,
        inProgress,
        resolved,
        highUrgentPriority,
        resolutionRate: totalReports > 0 ? Math.round((resolved / totalReports) * 100) : 0,
      },
      recentReports,
      priorityQueue,
    },
  });
};

// @desc    Get analytical charts data (Category, Status, Timelines, Wards)
// @route   GET /api/admin/analytics
// @access  Private (Admin)
const getAdminAnalytics = async (req, res) => {
  // 1. By Category aggregation
  const categoryStatsRaw = await Report.findAll({
    attributes: ['category', [sequelize.fn('COUNT', sequelize.col('category')), 'count']],
    group: ['category'],
    order: [[sequelize.literal('count'), 'DESC']],
    raw: true,
  });
  const categoryStats = categoryStatsRaw.map(c => ({ category: c.category, count: c.count }));

  // 2. By Status aggregation
  const statusStatsRaw = await Report.findAll({
    attributes: ['status', [sequelize.fn('COUNT', sequelize.col('status')), 'count']],
    group: ['status'],
    raw: true,
  });
  const statusStats = statusStatsRaw.map(s => ({ status: s.status, count: s.count }));

  // 3. By Priority aggregation
  const priorityStatsRaw = await Report.findAll({
    attributes: ['priority', [sequelize.fn('COUNT', sequelize.col('priority')), 'count']],
    group: ['priority'],
    raw: true,
  });
  const priorityStats = priorityStatsRaw.map(p => ({ priority: p.priority, count: p.count }));

  // 4. By Ward / Area distribution
  const wardStatsRaw = await Report.findAll({
    attributes: [
      'ward',
      [sequelize.fn('COUNT', sequelize.col('ward')), 'total'],
      [
        sequelize.fn('SUM', sequelize.literal("CASE WHEN status = 'RESOLVED' THEN 1 ELSE 0 END")),
        'resolved'
      ]
    ],
    group: ['ward'],
    order: [[sequelize.literal('total'), 'DESC']],
    limit: 8,
    raw: true,
  });
  const wardStats = wardStatsRaw.map(w => ({
    ward: w.ward,
    total: w.total,
    resolved: w.resolved || 0,
    pending: w.total - (w.resolved || 0),
  }));

  // 5. Trend: Last 7 Days count
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const timelineStatsRaw = await Report.findAll({
    where: { createdAt: { [Op.gte]: sevenDaysAgo } },
    attributes: [
      [sequelize.fn('date', sequelize.col('createdAt')), 'date'],
      [sequelize.fn('COUNT', sequelize.col('_id')), 'reported'],
      [
        sequelize.fn('SUM', sequelize.literal("CASE WHEN status = 'RESOLVED' THEN 1 ELSE 0 END")),
        'resolved'
      ]
    ],
    group: [sequelize.fn('date', sequelize.col('createdAt'))],
    order: [[sequelize.fn('date', sequelize.col('createdAt')), 'ASC']],
    raw: true,
  });

  const timelineStats = timelineStatsRaw.map(t => ({
    date: t.date,
    reported: t.reported,
    resolved: t.resolved || 0,
  }));

  res.json({
    success: true,
    data: {
      categoryStats,
      statusStats,
      priorityStats,
      wardStats,
      timelineStats,
    },
  });
};

// @desc    Update report status in workflow state machine
// @route   PATCH /api/admin/reports/:id/status
// @access  Private (Admin)
const updateReportStatus = async (req, res) => {
  const { status, note, priority } = req.body;
  const report = await Report.findByPk(req.params.id);

  if (!report) {
    return res.status(404).json({
      success: false,
      message: 'Report not found',
    });
  }

  const previousStatus = report.status;
  report.status = status;

  if (priority) {
    report.priority = priority;
  }

  if (status === 'RESOLVED') {
    report.resolvedAt = new Date();
  }

  const transaction = await sequelize.transaction();

  try {
    await report.save({ transaction });

    await ReportStatusHistory.create({
      status,
      changedById: req.user._id,
      changedByName: req.user.name,
      note: note || `Status transitioned from ${previousStatus} to ${status} by municipal officer.`,
      timestamp: new Date(),
      reportId: report._id,
    }, { transaction });

    // Create notification for citizen reporter
    const friendlyStatusMap = {
      REPORTED: 'Reported',
      UNDER_REVIEW: 'Under Review',
      ASSIGNED: 'Assigned to Municipal Team',
      IN_PROGRESS: 'Work In Progress',
      RESOLVED: 'Resolved & Verified',
    };

    await Notification.create({
      recipientId: report.reporterId,
      title: `Status Update: ${report.reportId}`,
      message: `Your report has been updated to "${friendlyStatusMap[status] || status}". ${note ? `Note: ${note}` : ''}`,
      type: 'STATUS_UPDATE',
      reportIdString: report.reportId,
      reportObjectId: report._id,
    }, { transaction });

    await transaction.commit();

    const updatedReport = await Report.findByPk(report._id, {
      include: [{ model: ReportStatusHistory, as: 'statusHistory' }],
    });

    res.json({
      success: true,
      data: updatedReport,
    });
  } catch (err) {
    await transaction.rollback();
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Assign report to municipal staff or department
// @route   PATCH /api/admin/reports/:id/assign
// @access  Private (Admin)
const assignReport = async (req, res) => {
  const { assignedTo, department, note } = req.body;
  const report = await Report.findByPk(req.params.id);

  if (!report) {
    return res.status(404).json({
      success: false,
      message: 'Report not found',
    });
  }

  let assignee = null;
  if (assignedTo) {
    assignee = await User.findByPk(assignedTo);
  }

  report.assignedToId = assignedTo || null;
  report.assignedDepartment = department || (assignee ? assignee.department : 'General Operations');
  
  if (report.status === 'REPORTED') {
    report.status = 'ASSIGNED';
  }

  const assigneeName = assignee ? assignee.name : 'Municipal Team';

  const transaction = await sequelize.transaction();

  try {
    await report.save({ transaction });

    await ReportStatusHistory.create({
      status: report.status,
      changedById: req.user._id,
      changedByName: req.user.name,
      note: note || `Assigned to ${assigneeName} (${report.assignedDepartment})`,
      timestamp: new Date(),
      reportId: report._id,
    }, { transaction });

    await Notification.create({
      recipientId: report.reporterId,
      title: `Team Assigned: ${report.reportId}`,
      message: `Your report has been assigned to ${assigneeName} (${report.assignedDepartment}) for field resolution.`,
      type: 'ASSIGNMENT',
      reportIdString: report.reportId,
      reportObjectId: report._id,
    }, { transaction });

    await transaction.commit();

    res.json({
      success: true,
      data: report,
    });
  } catch (err) {
    await transaction.rollback();
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get list of municipal officers for assignment dropdown
// @route   GET /api/admin/officers
// @access  Private (Admin)
const getOfficers = async (req, res) => {
  const officers = await User.findAll({
    where: { role: 'ADMIN' },
    attributes: ['_id', 'name', 'email', 'department', 'phone'],
    order: [['name', 'ASC']],
  });

  res.json({
    success: true,
    data: officers,
  });
};

module.exports = {
  getAdminDashboardMetrics,
  getAdminAnalytics,
  updateReportStatus,
  assignReport,
  getOfficers,
};
