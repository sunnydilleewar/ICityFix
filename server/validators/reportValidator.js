const { body, query, validationResult } = require('express-validator');

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

const createReportValidation = validate([
  body('title').trim().notEmpty().withMessage('Report title is required').isLength({ max: 150 }),
  body('category')
    .isIn([
      'ROADS_POTHOLES',
      'STREETLIGHTS',
      'WASTE_MANAGEMENT',
      'WATER_DRAINAGE',
      'PUBLIC_INFRASTRUCTURE',
      'SANITATION',
      'TRAFFIC_SIGNALS',
      'OTHER',
    ])
    .withMessage('Valid civic category is required'),
  body('description').trim().notEmpty().withMessage('Description is required').isLength({ max: 2000 }),
  body('coordinates')
    .isArray({ min: 2, max: 2 })
    .withMessage('Coordinates must be an array of [longitude, latitude]'),
]);

const statusUpdateValidation = validate([
  body('status')
    .isIn(['REPORTED', 'UNDER_REVIEW', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED'])
    .withMessage('Valid status state is required'),
  body('note').optional().isString(),
]);

module.exports = {
  createReportValidation,
  statusUpdateValidation,
};
