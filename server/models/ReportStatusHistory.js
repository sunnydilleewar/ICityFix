const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ReportStatusHistory = sequelize.define('ReportStatusHistory', {
    _id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [['REPORTED', 'UNDER_REVIEW', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED']],
      }
    },
    changedByName: {
      type: DataTypes.STRING,
      defaultValue: 'System',
    },
    note: {
      type: DataTypes.TEXT,
      defaultValue: '',
    },
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    }
  }, {
    timestamps: false, 
  });

  return ReportStatusHistory;
};
