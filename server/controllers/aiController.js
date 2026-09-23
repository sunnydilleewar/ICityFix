const { suggestCategory } = require('../services/aiService');

// @desc    Suggest category from civic report description
// @route   POST /api/ai/suggest-category
// @access  Public / Private
const getCategorySuggestion = async (req, res) => {
  const { description } = req.body;

  try {
    const suggestion = await suggestCategory(description);
    res.json({
      success: true,
      data: suggestion,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'AI categorization service encountered an error',
      error: error.message,
    });
  }
};

module.exports = {
  getCategorySuggestion,
};
