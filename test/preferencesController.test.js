const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const preferencesRoutes = require('../src/routes/preferencesRoutes');
const users = require('../src/models/userModel');
const jwt = require('jsonwebtoken');

const app = express();
app.use(bodyParser.json());
app.use('/api', preferencesRoutes);

const generateToken = (username) => {
    return jwt.sign({ username }, 'your_jwt_secret', { expiresIn: '1h' });
};

describe('Preferences Controller', () => {
    let token;

    beforeEach(() => {
        users.length = 0; // Clear the users array before each test
        users.push({ username: 'testuser@example.com', password: 'hashedpassword' });
        token = generateToken('testuser@example.com');
    });

    it('should get user preferences', async () => {
        const res = await request(app)
            .get('/api/preferences')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual({});
    });

    it('should update user preferences', async () => {
        const res = await request(app)
            .put('/api/preferences')
            .set('Authorization', `Bearer ${token}`)
            .send({ categories: ['technology'], languages: ['en'] });

        expect(res.statusCode).toEqual(200);
        expect(res.text).toEqual('Preferences updated successfully');
    });

    it('should not update preferences with invalid data', async () => {
        const res = await request(app)
            .put('/api/preferences')
            .set('Authorization', `Bearer ${token}`)
            .send({ categories: 'technology', languages: 'en' });

        expect(res.statusCode).toEqual(400);
        expect(res.text).toEqual('Categories and languages must be arrays');
    });
});
