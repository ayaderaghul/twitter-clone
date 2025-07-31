// tests/setup.js
const dbHelper = require('./dbHelper');

beforeAll(async () => {
  await dbHelper.connect();
});

afterEach(async () => {
  await dbHelper.clearDatabase();
});

afterAll(async () => {
  await dbHelper.disconnect();
});