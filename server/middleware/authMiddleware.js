const jwt = require('jsonwebtoken');
const { User } = require('../models');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'icityfix_super_secret_jwt_key_2026_production_grade_token'
      );

      req.user = await User.findByPk(decoded.id);

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'User session not found or user has been deleted',
        });
      }

      next();
    } catch (error) {
      console.error('[AuthMiddleware] Token verification failed:', error.message);
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token invalid or expired',
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, access token missing',
    });
  }
};

module.exports = { protect };
