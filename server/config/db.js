const { Sequelize } = require('sequelize');
const path = require('path');

const storagePath = path.join(__dirname, '../database.sqlite');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: storagePath,
  logging: false, // Set to console.log to see SQL queries
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
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
