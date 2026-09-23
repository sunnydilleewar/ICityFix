const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const dotenv = require('dotenv');
const { connectDB, closeDB } = require('./config/db');
const { sequelize, User } = require('./models');
const { Umzug, SequelizeStorage } = require('umzug');
const errorHandler = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const umzug = new Umzug({
  migrations: { glob: 'migrations/*.js' },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize }),
  logger: console,
});

const initializeDatabase = async () => {
  try {
    await connectDB();
    
    console.log('[DB] Running database migrations...');
    await umzug.up();
    console.log('[DB] Database migrations complete.');

    const userCount = await User.count();
    if (userCount === 0) {
      console.log('[DB] Detected empty database. Automatically running initial seed data...');
      try {
        const { seedData } = require('./scripts/seed');
        await seedData();
      } catch (err) {
        console.warn('[DB] Automatic seed skipped or failed:', err.message);
      }
    }
  } catch (err) {
    console.error('[DB] Connection/Migration error:', err.message);
    throw err;
  }
};

// Core Middlewares
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Root route for API sanity checks
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    service: 'iCityFix Municipal API',
    message: 'API is running. Use /api/health for service status.',
    timestamp: new Date().toISOString(),
  });
});

// Health Check API
app.get('/api/health', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.json({
      status: 'healthy',
      service: 'iCityFix Municipal API',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      database: {
        status: 'connected',
        dialect: 'sqlite'
      },
    });
  } catch (err) {
    res.status(500).json({
      status: 'unhealthy',
      database: { status: 'disconnected', error: err.message }
    });
  }
});

// Mount Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));
app.use('/api/uploads', require('./routes/uploadRoutes'));

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`,
  });
});

// Centralized Error Handling
app.use(errorHandler);

let server;

const startServer = async () => {
  try {
    await initializeDatabase();

    server = app.listen(PORT, () => {
      console.log(`=======================================================`);
      console.log(`  ICITYFIX MUNICIPAL TECH PLATFORM - BACKEND READY  `);
      console.log(`  Server Port : http://localhost:${PORT}             `);
      console.log(`  Health API  : http://localhost:${PORT}/api/health   `);
      console.log(`=======================================================`);
    });
  } catch (err) {
    console.error('[SERVER] Failed to initialize application:', err.message);
    process.exit(1);
  }
};

const shutdown = async () => {
  try {
    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }
    await closeDB();
    process.exit(0);
  } catch (err) {
    console.error('[SERVER] Shutdown error:', err.message);
    process.exit(1);
  }
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

startServer();

module.exports = app;
