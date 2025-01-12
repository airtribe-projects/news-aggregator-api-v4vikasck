const express = require('express');
const { getNews, markAsRead, markAsFavorite, getReadArticles, getFavoriteArticles, searchNews } = require('../controllers/newsController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/news', authMiddleware, getNews);
router.post('/news/:id/read', authMiddleware, markAsRead);
router.post('/news/:id/favorite', authMiddleware, markAsFavorite);
router.get('/news/read', authMiddleware, getReadArticles);
router.get('/news/favorites', authMiddleware, getFavoriteArticles);
router.get('/news/search/:keyword', authMiddleware, searchNews);

module.exports = router;