const express = require('express');
const { getPreferences, updatePreferences } = require('../controllers/preferencesController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/preferences', authMiddleware, getPreferences);
router.put('/preferences', authMiddleware, updatePreferences);

module.exports = router;