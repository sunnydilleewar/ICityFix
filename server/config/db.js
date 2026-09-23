const { Sequelize } = require('sequelize');
const path = require('path');

const storagePath = path.join(__dirname, '../database.sqlite');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: storagePath,
  logging: false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  retry: {
    max: 5,
    backoffBase: 300,
    backoffExponent: 1.5,
  },
  dialectOptions: {
    timeout: 30000,
    busyTimeout: 30000,
    // SQLite WAL mode reduces write contention across restarts and concurrent reads/writes.
    pragma: {
      journal_mode: 'WAL',
      foreign_keys: 1,
      synchronous: 1,
    },
  },
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.query('PRAGMA journal_mode=WAL;');
    await sequelize.query('PRAGMA busy_timeout = 30000;');
    console.log(`[DB] Successfully connected to SQLite database at ${storagePath}`);
    return sequelize;
  } catch (error) {
    console.error(`[DB] Critical: Failed to establish database connection:`, error.message);
    throw error;
  }
};

const closeDB = async () => {
  await sequelize.close();
};

module.exports = { sequelize, connectDB, closeDB };
