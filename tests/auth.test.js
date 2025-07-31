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
  // 1. Verify registration
  const regRes = await request(app)
    .post('/api/auth/register')
    .send(testUser);
  expect(regRes.statusCode).toBe(201);

  // 2. Check database state
  const dbUser = await User.findOne({ email: testUser.email });
  console.log('Database user:', {
    email: dbUser.email,
    passwordExists: !!dbUser.password
  });

  // 3. Attempt login
  const loginRes = await request(app)
    .post('/api/auth/login')
    .send({
      email: testUser.email,
      password: testUser.password
    });

  // 4. Debug output if failed
  if (loginRes.statusCode !== 200) {
    console.log('Registration response:', regRes.body);
    console.log('Login failure details:', loginRes.body);
  }

  expect(loginRes.statusCode).toBe(200);
  expect(loginRes.body.data).toHaveProperty('token');
});


});

afterAll(async () => {
    await mongoose.connection.close()
})
