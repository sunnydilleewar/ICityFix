const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
  getDemoCredentials,
} = require('../controllers/authController');
const {
  registerValidation,
  loginValidation,
} = require('../validators/authValidator');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerValidation, registerUser);
router.post('/login', loginValidation, loginUser);
router.get('/me', protect, getMe);
router.get('/demo-credentials', getDemoCredentials);

module.exports = router;
