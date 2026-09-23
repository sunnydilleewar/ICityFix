const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, upload.array('images', 4), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please upload at least one image file',
      });
    }

    const fileUrls = req.files.map((file) => `/uploads/${file.filename}`);

    res.json({
      success: true,
      data: fileUrls,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to process evidence image upload',
      error: error.message,
    });
  }
});

module.exports = router;
