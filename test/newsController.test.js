const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const newsRoutes = require('../src/routes/newsRoutes');
const users = require('../src/models/userModel');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');

const app = express();
app.use(bodyParser.json());
app.use('/api', newsRoutes);

const generateToken = (username) => {
    return jwt.sign({ username }, 'your_jwt_secret', { expiresIn: '1h' });
};

describe('News Controller', () => {
    let token;
    let mock;

    beforeEach(() => {
        users.length = 0; // Clear the users array before each test
        users.push({ username: 'testuser@example.com', password: 'hashedpassword', preferences: { categories: ['technology'], languages: ['en'] } });
        token = generateToken('testuser@example.com');
        mock = new MockAdapter(axios);
    });

    afterEach(() => {
        mock.restore();
    });

    it('should fetch news based on user preferences', async () => {
        mock.onGet('https://newsapi.org/v2/top-headlines').reply(200, { articles: [] });

        const res = await request(app)
            .get('/api/news')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('articles');
    });

    it('should mark an article as read', async () => {
        const res = await request(app)
            .post('/api/news/1/read')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(res.text).toEqual('Article marked as read');
    });

    it('should mark an article as favorite', async () => {
        const res = await request(app)
            .post('/api/news/1/favorite')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(res.text).toEqual('Article marked as favorite');
    });

    it('should get read articles', async () => {
        users[0].readArticles = ['1'];

        const res = await request(app)
            .get('/api/news/read')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(['1']);
    });

    it('should get favorite articles', async () => {
        users[0].favoriteArticles = ['1'];

        const res = await request(app)
            .get('/api/news/favorites')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(['1']);
    });

    it('should search news articles', async () => {
        mock.onGet('https://newsapi.org/v2/everything').reply(200, { articles: [] });

        const res = await request(app)
            .get('/api/news/search/test')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('articles');
    });
});
