const { body, validationResult } = require('express-validator');

const validate = (validations) => {
  return async (req, res, next) => {
    for (let validation of validations) {
      const result = await validation.run(req);
      if (result.errors.length) break;
    }

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg,
      errors: errors.array(),
    });
  };
};

const registerValidation = validate([
  body('name').trim().notEmpty().withMessage('Full name is required'),
  body('email').isEmail().withMessage('A valid email address is required').normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('role')
    .optional()
    .isIn(['CITIZEN', 'ADMIN'])
    .withMessage('Role must be either CITIZEN or ADMIN'),
]);

const loginValidation = validate([
  body('email').isEmail().withMessage('Please provide a valid email').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
]);

module.exports = {
  registerValidation,
  loginValidation,
};
