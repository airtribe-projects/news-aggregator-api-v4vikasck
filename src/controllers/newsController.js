const axios = require('axios');
const NodeCache = require('node-cache');
const users = require('../models/userModel');

const newsCache = new NodeCache({ stdTTL: 600 }); // Cache TTL of 10 minutes

const getNews = async (req, res) => {
    const user = users.find(u => u.username === req.user.username);
    if (!user) {
        return res.status(404).send('User not found');
    }

    const { categories = [], languages = [] } = user.preferences || {};
    const categoryQuery = categories[0] || ''; // Get the first category or an empty string
    const languageQuery = languages[0] || ''; // Get the first language or an empty string

    const cacheKey = `${categoryQuery}-${languageQuery}`;
    const cachedNews = newsCache.get(cacheKey);

    if (cachedNews) {
        return res.json(cachedNews);
    }

    try {
        const response = await axios.get('https://newsapi.org/v2/top-headlines', {
            params: {
                apiKey: '5bc6d814eee14e8095e0db6e6bef2238',
                category: categoryQuery,
                language: languageQuery
            }
        });
       // console.log('Fetched news data:', response.data);
        //console.log('categoryQuery:', categoryQuery);
        //console.log('languageQuery:', languageQuery);
        newsCache.set(cacheKey, response.data);
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching news articles:', error.response ? error.response.data : error.message);
        res.status(500).send('Failed to fetch news articles');
    }
};

const markAsRead = (req, res) => {
    const user = users.find(u => u.username === req.user.username);
    if (!user) {
        return res.status(404).send('User not found');
    }

    const { id } = req.params;
    user.readArticles = user.readArticles || [];
    if (!user.readArticles.includes(id)) {
        user.readArticles.push(id);
    }
    res.send('Article marked as read');
};

const markAsFavorite = (req, res) => {
    const user = users.find(u => u.username === req.user.username);
    if (!user) {
        return res.status(404).send('User not found');
    }

    const { id } = req.params;
    user.favoriteArticles = user.favoriteArticles || [];
    if (!user.favoriteArticles.includes(id)) {
        user.favoriteArticles.push(id);
    }
    res.send('Article marked as favorite');
};

const getReadArticles = (req, res) => {
    const user = users.find(u => u.username === req.user.username);
    if (!user) {
        return res.status(404).send('User not found');
    }
    res.json(user.readArticles || []);
};

const getFavoriteArticles = (req, res) => {
    const user = users.find(u => u.username === req.user.username);
    if (!user) {
        return res.status(404).send('User not found');
    }
    res.json(user.favoriteArticles || []);
};

const searchNews = async (req, res) => {
    const { keyword } = req.params;

    try {
        const response = await axios.get('https://newsapi.org/v2/everything', {
            params: {
                apiKey: '5bc6d814eee14e8095e0db6e6bef2238',
                q: keyword
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error searching news articles:', error.response ? error.response.data : error.message);
        res.status(500).send('Failed to search news articles');
    }
};

module.exports = { getNews, markAsRead, markAsFavorite, getReadArticles, getFavoriteArticles, searchNews };