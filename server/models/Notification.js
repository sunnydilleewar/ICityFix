const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Notification = sequelize.define('Notification', {
    _id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      defaultValue: 'STATUS_UPDATE',
      validate: {
        isIn: [['STATUS_UPDATE', 'ASSIGNMENT', 'REPORT_CREATED', 'SYSTEM']],
      }
    },
    reportIdString: { 
      type: DataTypes.STRING,
    },
    read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  }, {
    timestamps: true,
  });

  return Notification;
};
