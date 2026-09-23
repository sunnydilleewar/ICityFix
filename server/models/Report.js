const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Report = sequelize.define('Report', {
    _id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    reportId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Report title is required' },
      }
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [[
          'ROADS_POTHOLES',
          'STREETLIGHTS',
          'WASTE_MANAGEMENT',
          'WATER_DRAINAGE',
          'PUBLIC_INFRASTRUCTURE',
          'SANITATION',
          'TRAFFIC_SIGNALS',
          'OTHER'
        ]],
        notEmpty: { msg: 'Category is required' },
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Description is required' },
      }
    },
    images: {
      type: DataTypes.TEXT, // Storing JSON string array
      defaultValue: '[]',
      get() {
        const rawValue = this.getDataValue('images');
        return rawValue ? JSON.parse(rawValue) : [];
      },
      set(val) {
        this.setDataValue('images', JSON.stringify(val || []));
      }
    },
    longitude: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    latitude: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      defaultValue: 'Location recorded via GPS / Map coordinates',
    },
    ward: {
      type: DataTypes.STRING,
      defaultValue: 'Zone 1 - Central Ward',
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'REPORTED',
      validate: {
        isIn: [['REPORTED', 'UNDER_REVIEW', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED']],
      }
    },
    priority: {
      type: DataTypes.STRING,
      defaultValue: 'MEDIUM',
      validate: {
        isIn: [['LOW', 'MEDIUM', 'HIGH', 'URGENT']],
      }
    },
    assignedDepartment: {
      type: DataTypes.STRING,
      defaultValue: 'Unassigned',
    },
    resolvedAt: {
      type: DataTypes.DATE,
    },
    upvotes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    }
  }, {
    timestamps: true,
  });

  return Report;
};
