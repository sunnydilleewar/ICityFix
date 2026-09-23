const { sequelize } = require('../config/db');

const User = require('./User')(sequelize);
const Report = require('./Report')(sequelize);
const ReportStatusHistory = require('./ReportStatusHistory')(sequelize);
const Notification = require('./Notification')(sequelize);

// Define associations
User.hasMany(Report, { foreignKey: 'reporterId', as: 'reports' });
Report.belongsTo(User, { foreignKey: 'reporterId', as: 'reporter' });

User.hasMany(Report, { foreignKey: 'assignedToId', as: 'assignedReports' });
Report.belongsTo(User, { foreignKey: 'assignedToId', as: 'assignedTo' });

Report.hasMany(ReportStatusHistory, { foreignKey: 'reportId', as: 'statusHistory' });
ReportStatusHistory.belongsTo(Report, { foreignKey: 'reportId', as: 'report' });

User.hasMany(ReportStatusHistory, { foreignKey: 'changedById', as: 'statusChanges' });
ReportStatusHistory.belongsTo(User, { foreignKey: 'changedById', as: 'changedBy' });

// UpvotedBy relationship
Report.belongsToMany(User, { through: 'ReportUpvotes', as: 'upvotedBy', foreignKey: 'reportId', otherKey: 'userId' });
User.belongsToMany(Report, { through: 'ReportUpvotes', as: 'upvotedReports', foreignKey: 'userId', otherKey: 'reportId' });

Notification.belongsTo(User, { foreignKey: 'recipientId', as: 'recipient' });
User.hasMany(Notification, { foreignKey: 'recipientId', as: 'notifications' });

Notification.belongsTo(Report, { foreignKey: 'reportObjectId', as: 'report' });
Report.hasMany(Notification, { foreignKey: 'reportObjectId', as: 'notifications' });

module.exports = {
  sequelize,
  User,
  Report,
  ReportStatusHistory,
  Notification,
};
