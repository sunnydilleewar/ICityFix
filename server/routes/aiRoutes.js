const express = require('express');
const router = express.Router();
const { getCategorySuggestion } = require('../controllers/aiController');

router.post('/suggest-category', getCategorySuggestion);

module.exports = router;
