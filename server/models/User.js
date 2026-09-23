const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    _id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Name is required' },
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: 'Email address already in use'
      },
      validate: {
        isEmail: { msg: 'Please enter a valid email address' },
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: 'CITIZEN',
      validate: {
        isIn: [['CITIZEN', 'ADMIN']],
      }
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
  }, {
    timestamps: true,
    hooks: {
      beforeSave: async (user) => {
        if (user.changed('password')) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      }
    },
    defaultScope: {
      attributes: { exclude: ['password'] },
    },
    scopes: {
      withPassword: {
        attributes: {},
      }
    }
  });

  User.prototype.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  };

  return User;
};
