const request = require('supertest');
const app = require('../app'); // ✅ Import Express app
const mongoose = require('mongoose')
const User = require('../models/User')

describe('Auth API', () => {

    const testUser = {
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123'
  };

  // Clear database before all tests
  beforeAll(async () => {
    await User.deleteMany({});
  });

  // Clear database after each test
//   afterEach(async () => {
//     await User.deleteMany({});
//   });


  test('Register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser',
        password: 'password123',
        email: 'test@example.com',
        name: 'test'
      });

    expect(res.statusCode).toBe(201); // adjust if 200
  });

  

  test('Login user', async () => {
// 1. Register user and verify success
  const registerResponse = await request(app)
    .post('/api/auth/register')
    .send(testUser);
  
  expect(registerResponse.statusCode).toBe(201);
  
  // 2. Verify user exists in database
  const dbUser = await User.findOne({ email: testUser.email });
  console.log('Database User:', {
    email: dbUser.email,
    password: dbUser.password,
    _id: dbUser._id
  });

  // 2. Make login request
  const res = await request(app)
    .post('/api/auth/login')
    .send({
      email: testUser.email,
      password: testUser.password
    });

  // 3. Debug output
  console.log('Login Response:', {
    status: res.status,
    body: res.body,
    headers: res.headers
  });
  // 3. Enhanced debug output
  console.log('Full Error:', res.body.error || res.body);
  console.log('Request Payload:', {
    email: testUser.email,
    password: '***' // Don't log actual password
  });

  // 4. Assertions
  expect(res.statusCode).toBe(200);
  expect(res.body.data).toHaveProperty('token');
});


});

afterAll(async () => {
    await mongoose.connection.close()
})
