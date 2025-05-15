const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server'); // Assuming your Express app is exported from server.js
const User = require('../models/User');

describe('Auth Routes', () => {
  beforeAll(async () => {
    // Connect to the test database
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    // Disconnect from the test database
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Clear users collection before each test
    await User.deleteMany({});
  });

  test('Login with rikhishkh@gmail.com and password hiii sets isAdmin to true', async () => {
    // Create user with isAdmin false
    const user = new User({
      name: 'Rikhi',
      email: 'rikhishkh@gmail.com',
      password: 'hiii',
      isAdmin: false,
    });
    await user.save();

    // Login request
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'rikhishkh@gmail.com', password: 'hiii' });

    expect(res.statusCode).toBe(200);
    expect(res.body.user.isAdmin).toBe(true);

    // Verify in DB
    const updatedUser = await User.findOne({ email: 'rikhishkh@gmail.com' });
    expect(updatedUser.isAdmin).toBe(true);
  });

  test('Login with other user does not change isAdmin', async () => {
    const user = new User({
      name: 'Test User',
      email: 'testuser@example.com',
      password: 'password123',
      isAdmin: false,
    });
    await user.save();

    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'testuser@example.com', password: 'password123' });

    expect(res.statusCode).toBe(200);
    expect(res.body.user.isAdmin).toBe(false);

    const updatedUser = await User.findOne({ email: 'testuser@example.com' });
    expect(updatedUser.isAdmin).toBe(false);
  });

  test('Login with wrong password returns 400', async () => {
    const user = new User({
      name: 'Test User',
      email: 'testuser@example.com',
      password: 'password123',
      isAdmin: false,
    });
    await user.save();

    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'testuser@example.com', password: 'wrongpassword' });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Invalid credentials');
  });
});
