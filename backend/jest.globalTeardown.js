const { pool } = require('./tests/setup'); // Adjust path if necessary

module.exports = async () => {
  if (pool) {
    await pool.end();
    console.log('Database connection pool closed.');
  }
};
