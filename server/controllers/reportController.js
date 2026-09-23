const { Op } = require('sequelize');
const { sequelize, Report, User, ReportStatusHistory, Notification } = require('../models');
const { findPotentialDuplicates } = require('../services/duplicateDetectionService');

// Helper to generate professional report ID e.g. CF-2026-8391
function generateReportId() {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `CF-${year}-${randomNum}`;
}

// @desc    Create new civic report
// @route   POST /api/reports
// @access  Private (Citizen & Admin)
const createReport = async (req, res) => {
  const {
    title,
    category,
    description,
    coordinates, // [lng, lat]
    address,
    ward,
    priority,
    images,
  } = req.body;

  let reportId = generateReportId();
  while (await Report.findOne({ where: { reportId } })) {
    reportId = generateReportId();
  }

  const transaction = await sequelize.transaction();

  try {
    const newReport = await Report.create({
      reportId,
      title,
      category,
      description,
      images: images || [],
      longitude: parseFloat(coordinates[0]),
      latitude: parseFloat(coordinates[1]),
      address: address || 'Recorded via Civic GPS Coordinate',
      ward: ward || 'Zone 1 - Central Ward',
      priority: priority || 'MEDIUM',
      reporterId: req.user._id,
      status: 'REPORTED',
    }, { transaction });

    await ReportStatusHistory.create({
      status: 'REPORTED',
      changedById: req.user._id,
      changedByName: req.user.name,
      note: 'Issue reported by citizen via iCityFix mobile/web portal.',
      reportId: newReport._id,
      timestamp: new Date(),
    }, { transaction });

    await Notification.create({
      recipientId: req.user._id,
      title: 'Report Submitted',
      message: `Your report ${newReport.reportId} has been submitted and queued for municipal review.`,
      type: 'REPORT_CREATED',
      reportIdString: newReport.reportId,
      reportObjectId: newReport._id,
    }, { transaction });

    await transaction.commit();

    res.status(201).json({
      success: true,
      data: newReport,
    });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get reports with search, filter, pagination
// @route   GET /api/reports
// @access  Public (or Protected)
const getReports = async (req, res) => {
  const {
    search,
    category,
    status,
    priority,
    ward,
    sort = '-createdAt',
    page = 1,
    limit = 20,
  } = req.query;

  const where = {};

  if (category && category !== 'ALL') where.category = category;
  if (status && status !== 'ALL') where.status = status;
  if (priority && priority !== 'ALL') where.priority = priority;
  if (ward && ward !== 'ALL') {
    where.ward = { [Op.like]: `%${ward}%` };
  }

  if (search && search.trim().length > 0) {
    const s = `%${search.trim()}%`;
    where[Op.or] = [
      { title: { [Op.like]: s } },
      { description: { [Op.like]: s } },
      { reportId: { [Op.like]: s } },
      { address: { [Op.like]: s } },
      { ward: { [Op.like]: s } },
    ];
  }

  const pageNum = parseInt(page, 10) || 1;
  const pageLimit = parseInt(limit, 10) || 20;
  const offset = (pageNum - 1) * pageLimit;

  let order = [['createdAt', 'DESC']];
  if (sort === 'createdAt') order = [['createdAt', 'ASC']];
  if (sort === '-upvotes') order = [['upvotes', 'DESC']];
  if (sort === 'upvotes') order = [['upvotes', 'ASC']];

  const { count, rows } = await Report.findAndCountAll({
    where,
    include: [
      { model: User, as: 'reporter', attributes: ['name', 'email', 'avatar', 'role'] },
      { model: User, as: 'assignedTo', attributes: ['name', 'email', 'department'] }
    ],
    order,
    offset,
    limit,
    distinct: true
  });
  
  // Format location field for frontend
  const data = rows.map(r => {
    const plain = r.get({ plain: true });
    plain.location = { coordinates: [plain.longitude, plain.latitude] };
    return plain;
  });

  res.json({
    success: true,
    count: data.length,
    total: count,
    page: pageNum,
    pages: Math.ceil(count / pageLimit),
    data: data,
  });
};

// @desc    Get reports reported by current authenticated user
// @route   GET /api/reports/my
// @access  Private
const getMyReports = async (req, res) => {
  const reports = await Report.findAll({
    where: { reporterId: req.user._id },
    include: [
      { model: User, as: 'assignedTo', attributes: ['name', 'department'] }
    ],
    order: [['createdAt', 'DESC']]
  });

  const data = reports.map(r => {
    const plain = r.get({ plain: true });
    plain.location = { coordinates: [plain.longitude, plain.latitude] };
    return plain;
  });

  res.json({
    success: true,
    count: data.length,
    data: data,
  });
};

// @desc    Get single report by ID or ReportId string
// @route   GET /api/reports/:id
// @access  Public / Private
const getReportById = async (req, res) => {
  const { id } = req.params;

  let where = {};
  if (id.startsWith('CF-')) {
    where = { reportId: id };
  } else {
    where = { _id: id };
  }

  const report = await Report.findOne({
    where,
    include: [
      { model: User, as: 'reporter', attributes: ['name', 'email', 'phone', 'avatar'] },
      { model: User, as: 'assignedTo', attributes: ['name', 'email', 'department'] },
      { 
        model: ReportStatusHistory, 
        as: 'statusHistory',
        include: [{ model: User, as: 'changedBy', attributes: ['name', 'role', 'department'] }]
      }
    ],
    order: [
      [{ model: ReportStatusHistory, as: 'statusHistory' }, 'timestamp', 'ASC']
    ]
  });

  if (!report) {
    return res.status(404).json({
      success: false,
      message: 'Civic report not found with provided identifier',
    });
  }

  const reportData = report.get({ plain: true });
  reportData.location = { coordinates: [reportData.longitude, reportData.latitude] };

  res.json({
    success: true,
    data: reportData,
  });
};

// @desc    Advisory duplicate check endpoint
// @route   GET /api/reports/duplicates
// @access  Public
const checkDuplicates = async (req, res) => {
  const { lng, lat, category, maxDistance } = req.query;

  if (!lng || !lat) {
    return res.status(400).json({
      success: false,
      message: 'Longitude (lng) and Latitude (lat) are required query parameters',
    });
  }

  const duplicates = await findPotentialDuplicates({
    lng,
    lat,
    category,
    maxDistance: maxDistance ? parseInt(maxDistance, 10) : 500,
  });

  res.json({
    success: true,
    count: duplicates.length,
    hasPotentialDuplicate: duplicates.length > 0,
    data: duplicates,
  });
};

// @desc    Get nearby reports for map
// @route   GET /api/reports/nearby
// @access  Public
const getNearbyReports = async (req, res) => {
  const { lng, lat, radius = 5000, category, status } = req.query;

  if (!lng || !lat) {
    return res.status(400).json({
      success: false,
      message: 'Query params lng and lat are required',
    });
  }

  const longitude = parseFloat(lng);
  const latitude = parseFloat(lat);
  const maxDistance = parseFloat(radius);

  const latDelta = maxDistance / 111000;
  const lngDelta = maxDistance / (111000 * Math.cos(latitude * (Math.PI / 180)));

  const where = {
    latitude: { [Op.between]: [latitude - latDelta, latitude + latDelta] },
    longitude: { [Op.between]: [longitude - lngDelta, longitude + lngDelta] },
  };

  if (category && category !== 'ALL') where.category = category;
  if (status && status !== 'ALL') where.status = status;

  const nearby = await Report.findAll({
    where,
    attributes: ['_id', 'reportId', 'title', 'category', 'status', 'priority', 'longitude', 'latitude', 'address', 'ward', 'createdAt', 'images', 'upvotes'],
    limit: 50,
  });

  const data = nearby.map(r => {
    const raw = r.get({ plain: true });
    raw.location = { coordinates: [raw.longitude, raw.latitude] };
    return raw;
  });

  res.json({
    success: true,
    count: data.length,
    data: data,
  });
};

// @desc    Upvote a civic report
// @route   POST /api/reports/:id/upvote
// @access  Private
const upvoteReport = async (req, res) => {
  const report = await Report.findByPk(req.params.id);

  if (!report) {
    return res.status(404).json({
      success: false,
      message: 'Report not found',
    });
  }

  const hasUpvoted = await report.hasUpvotedBy(req.user._id);

  if (hasUpvoted) {
    await report.removeUpvotedBy(req.user._id);
    report.upvotes = Math.max(0, report.upvotes - 1);
  } else {
    await report.addUpvotedBy(req.user._id);
    report.upvotes += 1;
  }

  await report.save();

  res.json({
    success: true,
    upvotes: report.upvotes,
    hasUpvoted: !hasUpvoted,
  });
};

module.exports = {
  createReport,
  getReports,
  getMyReports,
  getReportById,
  checkDuplicates,
  getNearbyReports,
  upvoteReport,
};
