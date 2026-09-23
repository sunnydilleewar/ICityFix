const jwt = require('jsonwebtoken');
const { User } = require('../models');

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'icityfix_super_secret_jwt_key_2026_production_grade_token',
    { expiresIn: '30d' }
  );
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, password, role, phone, ward, department } = req.body;

  const userExists = await User.findOne({ where: { email: email.toLowerCase() } });

  if (userExists) {
    return res.status(400).json({
      success: false,
      message: 'An account with this email already exists',
    });
  }

  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password,
    role: role || 'CITIZEN',
    phone: phone || '',
    ward: ward || 'Central Ward',
    department: role === 'ADMIN' ? (department || 'General Civic Administration') : 'Citizen',
  });

  if (user) {
    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        ward: user.ward,
        token: generateToken(user._id),
      },
    });
  } else {
    res.status(400).json({
      success: false,
      message: 'Invalid user registration data',
    });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.scope('withPassword').findOne({ where: { email: email.toLowerCase() } });

  if (user && (await user.matchPassword(password))) {
    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        ward: user.ward,
        token: generateToken(user._id),
      },
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Invalid email or password',
    });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  const user = await User.findByPk(req.user._id);

  if (user) {
    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        ward: user.ward,
        createdAt: user.createdAt,
      },
    });
  } else {
    res.status(404).json({
      success: false,
      message: 'User profile not found',
    });
  }
};

// @desc    Get demo credentials for hackathon demonstration
// @route   GET /api/auth/demo-credentials
// @access  Public
const getDemoCredentials = (req, res) => {
  res.json({
    success: true,
    data: [
      {
        role: 'CITIZEN',
        label: 'Citizen Demo Account',
        email: 'citizen@icityfix.local',
        password: 'iCityFix@123',
        description: 'Test citizen reporting, duplicate detection, and personal tracking',
      },
      {
        role: 'ADMIN',
        label: 'Municipal Admin Demo Account',
        email: 'admin@icityfix.local',
        password: 'iCityFix@123',
        description: 'Test operations dashboard, assignment, workflow triage, and analytics',
      },
    ],
  });
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  getDemoCredentials,
};
