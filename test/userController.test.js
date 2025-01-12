const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('../src/routes/userRoutes');
const users = require('../src/models/userModel');

const app = express();
app.use(bodyParser.json());
app.use('/api', userRoutes);

describe('User Controller', () => {
    beforeEach(() => {
        users.length = 0; // Clear the users array before each test
    });

    it('should register a new user', async () => {
        const res = await request(app)
            .post('/api/register')
            .send({ username: 'testuser@example.com', password: 'testpassword' });

        expect(res.statusCode).toEqual(201);
        expect(res.text).toEqual('User registered successfully');
    });

    it('should not register a user with invalid email', async () => {
        const res = await request(app)
            .post('/api/register')
            .send({ username: 'invalidemail', password: 'testpassword' });

        expect(res.statusCode).toEqual(400);
        expect(res.text).toEqual('Invalid email format');
    });

    it('should not register a user with short password', async () => {
        const res = await request(app)
            .post('/api/register')
            .send({ username: 'testuser@example.com', password: 'short' });

        expect(res.statusCode).toEqual(400);
        expect(res.text).toEqual('Password must be at least 6 characters long');
    });

    it('should login a registered user', async () => {
        await request(app)
            .post('/api/register')
            .send({ username: 'testuser@example.com', password: 'testpassword' });

        const res = await request(app)
            .post('/api/login')
            .send({ username: 'testuser@example.com', password: 'testpassword' });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
    });

    it('should not login with invalid credentials', async () => {
        const res = await request(app)
            .post('/api/login')
            .send({ username: 'nonexistent@example.com', password: 'wrongpassword' });

        expect(res.statusCode).toEqual(400);
        expect(res.text).toEqual('Invalid credentials');
    });
});
