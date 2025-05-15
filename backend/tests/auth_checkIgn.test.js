const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server'); // Assuming your Express app is exported from server.js

describe('GET /auth/check-ign/:mlbbId/:serverId', () => {
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

  test('should return ign for valid mlbbId and serverId', async () => {
    const mlbbId = '523899934';
    const serverId = '8111';

    const res = await request(app).get(`/auth/check-ign/${mlbbId}/${serverId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('ign');
    expect(typeof res.body.ign).toBe('string');
    expect(res.body.ign.length).toBeGreaterThan(0);
  });

  test('should return 400 for missing mlbbId or serverId', async () => {
    const res1 = await request(app).get('/auth/check-ign//8111');
    expect(res1.statusCode).toBe(400);

    const res2 = await request(app).get('/auth/check-ign/523899934/');
    expect(res2.statusCode).toBe(400);
  });

  test('should return 400 for invalid mlbbId or serverId', async () => {
    const res = await request(app).get('/auth/check-ign/invalidId/invalidServer');
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });
});
