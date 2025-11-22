require('dotenv').config({ path: './.env.test' });

const app = require('../index');
const pool = require('../db');

// This setup is basic. For a real application, you'd typically
// use a separate test database and handle migrations/seeding here.

module.exports = { app, pool };
