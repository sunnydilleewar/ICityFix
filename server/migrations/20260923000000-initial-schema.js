const { DataTypes } = require('sequelize');

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable('Users', {
      _id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.STRING,
        defaultValue: 'CITIZEN',
      },
      phone: {
        type: DataTypes.STRING,
      },
      department: {
        type: DataTypes.STRING,
        defaultValue: 'General Civic Administration',
      },
      ward: {
        type: DataTypes.STRING,
        defaultValue: 'Central Ward',
      },
      avatar: {
        type: DataTypes.STRING,
        defaultValue: '',
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      }
    });

    await queryInterface.createTable('Reports', {
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
      },
      category: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      images: {
        type: DataTypes.TEXT,
        defaultValue: '[]',
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
      },
      priority: {
        type: DataTypes.STRING,
        defaultValue: 'MEDIUM',
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
      },
      reporterId: {
        type: DataTypes.UUID,
        references: {
          model: 'Users',
          key: '_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      assignedToId: {
        type: DataTypes.UUID,
        references: {
          model: 'Users',
          key: '_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      }
    });

    await queryInterface.createTable('ReportStatusHistories', {
      _id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
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
      },
      reportId: {
        type: DataTypes.UUID,
        references: {
          model: 'Reports',
          key: '_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      changedById: {
        type: DataTypes.UUID,
        references: {
          model: 'Users',
          key: '_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    });

    await queryInterface.createTable('ReportUpvotes', {
      reportId: {
        type: DataTypes.UUID,
        references: {
          model: 'Reports',
          key: '_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        references: {
          model: 'Users',
          key: '_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        primaryKey: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      }
    });

    await queryInterface.createTable('Notifications', {
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
      },
      reportIdString: {
        type: DataTypes.STRING,
      },
      read: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      recipientId: {
        type: DataTypes.UUID,
        references: {
          model: 'Users',
          key: '_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      reportObjectId: {
        type: DataTypes.UUID,
        references: {
          model: 'Reports',
          key: '_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      }
    });
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('Notifications');
    await queryInterface.dropTable('ReportUpvotes');
    await queryInterface.dropTable('ReportStatusHistories');
    await queryInterface.dropTable('Reports');
    await queryInterface.dropTable('Users');
  }
};
