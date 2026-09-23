const dotenv = require('dotenv');
const { sequelize, User, Report, ReportStatusHistory, Notification } = require('../models');
const { connectDB } = require('../config/db');
const { Umzug, SequelizeStorage } = require('umzug');
const path = require('path');

dotenv.config();

const seedData = async () => {
  const transaction = await sequelize.transaction();
  try {
    console.log('[Seed] Clearing existing demo data...');
    // Delete in correct order to avoid FK constraint errors
    await Notification.destroy({ where: {}, transaction });
    await ReportStatusHistory.destroy({ where: {}, transaction });
    await sequelize.models.ReportUpvotes.destroy({ where: {}, transaction });
    await Report.destroy({ where: {}, transaction });
    await User.destroy({ where: {}, transaction });

    console.log('[Seed] Creating demo accounts...');
    // Seed Users
    const citizenUser = await User.create({
      name: 'Aarav Sharma',
      email: 'citizen@icityfix.local',
      password: 'iCityFix@123',
      role: 'CITIZEN',
      phone: '+91 98765 43210',
      ward: 'Ward 112 - Domlur',
      department: 'Citizen',
    }, { transaction });

    const citizen2User = await User.create({
      name: 'Priya Iyer',
      email: 'citizen2@icityfix.local',
      password: 'iCityFix@123',
      role: 'CITIZEN',
      phone: '+91 98123 45678',
      ward: 'Ward 150 - Bellandur',
      department: 'Citizen',
    }, { transaction });

    const adminUser = await User.create({
      name: 'Rajesh Verma (Chief Municipal Officer)',
      email: 'admin@icityfix.local',
      password: 'iCityFix@123',
      role: 'ADMIN',
      phone: '+91 98450 11223',
      department: 'Municipal Operations Directorate',
      ward: 'Central Municipal Zone',
    }, { transaction });

    const officerRoads = await User.create({
      name: 'Eng. Suresh Patil',
      email: 'officer.roads@icityfix.local',
      password: 'iCityFix@123',
      role: 'ADMIN',
      phone: '+91 98220 99887',
      department: 'Roads & Infrastructure Engineering',
      ward: 'East Zone',
    }, { transaction });

    const officerSanitation = await User.create({
      name: 'Ananya Deshmukh',
      email: 'officer.sanitation@icityfix.local',
      password: 'iCityFix@123',
      role: 'ADMIN',
      phone: '+91 98330 44556',
      department: 'Solid Waste & Sanitation Management',
      ward: 'South Zone',
    }, { transaction });

    console.log('[Seed] Creating realistic Indian civic reports...');

    const reportsData = [
      {
        reportId: 'CF-2026-1001',
        title: 'Deep crater pothole near Indiranagar Metro Station exit',
        category: 'ROADS_POTHOLES',
        description: 'Large crater (approx 2ft wide and 6 inches deep) on the left lane directly outside Indiranagar Metro exit towards 100ft Road. Two wheelers constantly swerving into oncoming traffic causing accidents.',
        longitude: 77.6412,
        latitude: 12.9716,
        address: 'CMH Road, Indiranagar, Bengaluru, Karnataka 560038',
        ward: 'Ward 112 - Domlur',
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        reporterId: citizenUser._id,
        assignedToId: officerRoads._id,
        assignedDepartment: 'Roads & Infrastructure Engineering',
        images: ['https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80'],
        upvotes: 24,
        createdAt: new Date(Date.now() - 4 * 86400000),
        statusHistory: [
          {
            status: 'REPORTED',
            changedById: citizenUser._id,
            changedByName: 'Aarav Sharma',
            note: 'Initial report filed via iCityFix portal.',
            timestamp: new Date(Date.now() - 4 * 86400000),
          },
          {
            status: 'UNDER_REVIEW',
            changedById: adminUser._id,
            changedByName: 'Rajesh Verma',
            note: 'Assessed as high-risk road hazard due to peak metro traffic volume.',
            timestamp: new Date(Date.now() - 3 * 86400000),
          },
          {
            status: 'ASSIGNED',
            changedById: adminUser._id,
            changedByName: 'Rajesh Verma',
            note: 'Dispatched to East Zone road asphalt repair team.',
            timestamp: new Date(Date.now() - 2 * 86400000),
          },
          {
            status: 'IN_PROGRESS',
            changedById: officerRoads._id,
            changedByName: 'Eng. Suresh Patil',
            note: 'Patching squad on site with cold-mix bitumen. Completion scheduled today.',
            timestamp: new Date(Date.now() - 1 * 86400000),
          },
        ],
      },
      {
        reportId: 'CF-2026-1002',
        title: 'Dangerous road crater at CMH & 100ft Road junction',
        category: 'ROADS_POTHOLES',
        description: 'Pothole on the asphalt surface near the junction curb. Causes heavy water logging during rains and severe vehicle slowdown.',
        longitude: 77.6418,
        latitude: 12.9721,
        address: '100ft Road & CMH Corner, Indiranagar, Bengaluru, Karnataka',
        ward: 'Ward 112 - Domlur',
        status: 'UNDER_REVIEW',
        priority: 'HIGH',
        reporterId: citizen2User._id,
        assignedToId: null,
        assignedDepartment: 'Roads & Infrastructure Engineering',
        images: ['https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80'],
        upvotes: 12,
        createdAt: new Date(Date.now() - 2 * 86400000),
        statusHistory: [
          {
            status: 'REPORTED',
            changedById: citizen2User._id,
            changedByName: 'Priya Iyer',
            note: 'Reported with photo evidence.',
            timestamp: new Date(Date.now() - 2 * 86400000),
          },
          {
            status: 'UNDER_REVIEW',
            changedById: adminUser._id,
            changedByName: 'Rajesh Verma',
            note: 'Correlated with nearby road maintenance ticket.',
            timestamp: new Date(Date.now() - 1 * 86400000),
          },
        ],
      },
      {
        reportId: 'CF-2026-1003',
        title: 'Overflowing commercial waste bin near Russell Market entrance',
        category: 'WASTE_MANAGEMENT',
        description: 'Municipal garbage compactor container has not been cleared for 48 hours. Waste spilling onto the pedestrian pathway and attracting stray cattle.',
        longitude: 77.6045,
        latitude: 12.9839,
        address: 'Russell Market Road, Shivajinagar, Bengaluru, Karnataka 560051',
        ward: 'Ward 92 - Shivajinagar',
        status: 'ASSIGNED',
        priority: 'URGENT',
        reporterId: citizenUser._id,
        assignedToId: officerSanitation._id,
        assignedDepartment: 'Solid Waste & Sanitation Management',
        images: ['https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=800&q=80'],
        upvotes: 31,
        createdAt: new Date(Date.now() - 1 * 86400000),
        statusHistory: [
          {
            status: 'REPORTED',
            changedById: citizenUser._id,
            changedByName: 'Aarav Sharma',
            note: 'Reported urgently due to market hygiene hazard.',
            timestamp: new Date(Date.now() - 1 * 86400000),
          },
          {
            status: 'ASSIGNED',
            changedById: adminUser._id,
            changedByName: 'Rajesh Verma',
            note: 'Assigned to Shivajinagar mechanical compactors unit.',
            timestamp: new Date(Date.now() - 12 * 3600000),
          },
        ],
      },
      {
        reportId: 'CF-2026-1004',
        title: 'Non-functional streetlights across entire 12th Main HAL 2nd Stage',
        category: 'STREETLIGHTS',
        description: 'Eight consecutive street lamps are completely dark between 12th Main Cross 4 and Cross 8. Total pitch dark stretch creating safety issues for pedestrians and women commuting back from office.',
        longitude: 77.6482,
        latitude: 12.9685,
        address: '12th Main, HAL 2nd Stage, Indiranagar, Bengaluru, Karnataka 560008',
        ward: 'Ward 112 - Domlur',
        status: 'RESOLVED',
        priority: 'MEDIUM',
        reporterId: citizen2User._id,
        assignedToId: adminUser._id,
        assignedDepartment: 'Electrical & Lighting Cell',
        resolvedAt: new Date(Date.now() - 1 * 86400000),
        images: ['https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80'],
        upvotes: 18,
        createdAt: new Date(Date.now() - 6 * 86400000),
        statusHistory: [
          {
            status: 'REPORTED',
            changedById: citizen2User._id,
            changedByName: 'Priya Iyer',
            note: 'Reported dark stretch.',
            timestamp: new Date(Date.now() - 6 * 86400000),
          },
          {
            status: 'ASSIGNED',
            changedById: adminUser._id,
            changedByName: 'Rajesh Verma',
            note: 'Routed to BESCOM municipal lighting liaison.',
            timestamp: new Date(Date.now() - 5 * 86400000),
          },
          {
            status: 'IN_PROGRESS',
            changedById: adminUser._id,
            changedByName: 'Rajesh Verma',
            note: 'Feeder pillar cable replaced by maintenance team.',
            timestamp: new Date(Date.now() - 3 * 86400000),
          },
          {
            status: 'RESOLVED',
            changedById: adminUser._id,
            changedByName: 'Rajesh Verma',
            note: 'All 8 LED luminaires tested and functional. Verified by ward engineer.',
            timestamp: new Date(Date.now() - 1 * 86400000),
          },
        ],
      },
      {
        reportId: 'CF-2026-1005',
        title: 'Broken stormwater drain slab and open manhole near Sony World Junction',
        category: 'WATER_DRAINAGE',
        description: 'Reinforced concrete slab over the stormwater drain is broken and caved in. Footpath users are at risk of falling into 6ft deep drain.',
        longitude: 77.6258,
        latitude: 12.9344,
        address: '80 Feet Road, 4th Block, Koramangala, Bengaluru, Karnataka 560034',
        ward: 'Ward 151 - Koramangala',
        status: 'REPORTED',
        priority: 'URGENT',
        reporterId: citizenUser._id,
        assignedToId: null,
        assignedDepartment: 'Stormwater Drainage & SWD Cell',
        images: ['https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80'],
        upvotes: 42,
        createdAt: new Date(Date.now() - 5 * 3600000),
        statusHistory: [
          {
            status: 'REPORTED',
            changedById: citizenUser._id,
            changedByName: 'Aarav Sharma',
            note: 'Flagged with critical urgency due to school zone proximity.',
            timestamp: new Date(Date.now() - 5 * 3600000),
          },
        ],
      },
      {
        reportId: 'CF-2026-1006',
        title: 'Faulty pedestrian zebra crossing signal timer at Bellandur junction',
        category: 'TRAFFIC_SIGNALS',
        description: 'Pedestrian signal stays green for only 4 seconds which is insufficient for senior citizens and school children to cross the 6-lane road.',
        longitude: 77.6749,
        latitude: 12.9298,
        address: 'Outer Ring Road, Bellandur, Bengaluru, Karnataka 560103',
        ward: 'Ward 150 - Bellandur',
        status: 'IN_PROGRESS',
        priority: 'MEDIUM',
        reporterId: citizen2User._id,
        assignedToId: officerRoads._id,
        assignedDepartment: 'Traffic Police & Signal Maintenance',
        images: ['https://images.unsplash.com/photo-1508873696983-2df5703bc20d?auto=format&fit=crop&w=800&q=80'],
        upvotes: 15,
        createdAt: new Date(Date.now() - 3 * 86400000),
        statusHistory: [
          {
            status: 'REPORTED',
            changedById: citizen2User._id,
            changedByName: 'Priya Iyer',
            note: 'Reported timer malfunction.',
            timestamp: new Date(Date.now() - 3 * 86400000),
          },
          {
            status: 'IN_PROGRESS',
            changedById: officerRoads._id,
            changedByName: 'Eng. Suresh Patil',
            note: 'Joint inspection scheduled with traffic police inspector.',
            timestamp: new Date(Date.now() - 1 * 86400000),
          },
        ],
      },
      {
        reportId: 'CF-2026-1007',
        title: 'Damaged public park exercise equipment and rusted railing',
        category: 'PUBLIC_INFRASTRUCTURE',
        description: 'Children playground swing chain snapped and outdoor open gym elliptical walker broken with sharp exposed metal.',
        longitude: 77.5912,
        latitude: 12.9234,
        address: 'Madhavan Park, 3rd Block, Jayanagar, Bengaluru, Karnataka 560011',
        ward: 'Ward 153 - Jayanagar',
        status: 'RESOLVED',
        priority: 'LOW',
        reporterId: citizenUser._id,
        assignedToId: adminUser._id,
        assignedDepartment: 'Horticulture & Parks Department',
        resolvedAt: new Date(Date.now() - 2 * 86400000),
        images: ['https://images.unsplash.com/photo-1579208575657-c595a05383b7?auto=format&fit=crop&w=800&q=80'],
        upvotes: 7,
        createdAt: new Date(Date.now() - 8 * 86400000),
        statusHistory: [
          {
            status: 'REPORTED',
            changedById: citizenUser._id,
            changedByName: 'Aarav Sharma',
            note: 'Report filed with ward office.',
            timestamp: new Date(Date.now() - 8 * 86400000),
          },
          {
            status: 'RESOLVED',
            changedById: adminUser._id,
            changedByName: 'Rajesh Verma',
            note: 'Welding completed and park equipment certified safe.',
            timestamp: new Date(Date.now() - 2 * 86400000),
          },
        ],
      },
      {
        reportId: 'CF-2026-1008',
        title: 'Untreated sewage overflow on service road near Marathahalli Bridge',
        category: 'SANITATION',
        description: 'Severe sewage line blockage causing raw waste water to spill continuously over the bus stop walkway.',
        longitude: 77.6974,
        latitude: 12.9569,
        address: 'Marathahalli Bridge Service Road, Bengaluru, Karnataka 560037',
        ward: 'Ward 85 - Doddanekkundi',
        status: 'UNDER_REVIEW',
        priority: 'URGENT',
        reporterId: citizen2User._id,
        assignedToId: officerSanitation._id,
        assignedDepartment: 'Solid Waste & Sanitation Management',
        images: ['https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80'],
        upvotes: 38,
        createdAt: new Date(Date.now() - 18 * 3600000),
        statusHistory: [
          {
            status: 'REPORTED',
            changedById: citizen2User._id,
            changedByName: 'Priya Iyer',
            note: 'Reported health hazard.',
            timestamp: new Date(Date.now() - 18 * 3600000),
          },
          {
            status: 'UNDER_REVIEW',
            changedById: adminUser._id,
            changedByName: 'Rajesh Verma',
            note: 'Sanitation jetting machine team notified for urgent clearing.',
            timestamp: new Date(Date.now() - 4 * 3600000),
          },
        ],
      },
    ];

    for (const rep of reportsData) {
      await Report.create(rep, {
        include: [{ model: ReportStatusHistory, as: 'statusHistory' }],
        transaction
      });
    }

    console.log('[Seed] Generating initial notifications...');
    const report1 = await Report.findOne({ where: { reportId: 'CF-2026-1001' }, transaction });
    await Notification.create({
      recipientId: citizenUser._id,
      title: 'Status Update: CF-2026-1001',
      message: 'Your report "Deep crater pothole near Indiranagar Metro Station" is now IN PROGRESS with Eng. Suresh Patil on site.',
      type: 'STATUS_UPDATE',
      reportIdString: 'CF-2026-1001',
      reportObjectId: report1._id,
      read: false,
    }, { transaction });

    const report2 = await Report.findOne({ where: { reportId: 'CF-2026-1004' }, transaction });
    await Notification.create({
      recipientId: citizen2User._id,
      title: 'Resolution Completed: CF-2026-1004',
      message: 'Streetlight repairs on 12th Main HAL 2nd Stage have been verified and marked RESOLVED.',
      type: 'STATUS_UPDATE',
      reportIdString: 'CF-2026-1004',
      reportObjectId: report2._id,
      read: false,
    }, { transaction });

    await transaction.commit();
    console.log('[Seed] Database successfully seeded with demo accounts & realistic civic issues.');
    console.log('[Seed] Demo Citizen : citizen@icityfix.local | iCityFix@123');
    console.log('[Seed] Demo Admin   : admin@icityfix.local   | iCityFix@123');
  } catch (error) {
    await transaction.rollback();
    console.error('[Seed] Error seeding database:', error);
    throw error;
  }
};

if (require.main === module) {
  connectDB()
    .then(async () => {
      const umzug = new Umzug({
        migrations: { glob: 'migrations/*.js' },
        context: sequelize.getQueryInterface(),
        storage: new SequelizeStorage({ sequelize }),
        logger: console,
      });
      await umzug.up();
      await seedData();
      process.exit(0);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

module.exports = { seedData };
