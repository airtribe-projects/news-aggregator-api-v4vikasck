const users = require('../models/userModel');

const getPreferences = (req, res) => {
    const user = users.find(u => u.username === req.user.username);
    if (!user) {
        return res.status(404).send('User not found');
    }
    res.json(user.preferences || {});
};

const updatePreferences = (req, res) => {
    const user = users.find(u => u.username === req.user.username);
    if (!user) {
        return res.status(404).send('User not found');
    }

    const { categories, languages } = req.body;

    if (!Array.isArray(categories) || !Array.isArray(languages)) {
        return res.status(400).send('Categories and languages must be arrays');
    }

    user.preferences = req.body;
    res.send('Preferences updated successfully');
};

module.exports = { getPreferences, updatePreferences };