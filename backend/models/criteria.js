const pool = require('../configs/db');

exports.createCriteria = async (name) => {
  const query = 'INSERT INTO criteria (name) VALUES ($1) RETURNING *';
  const res = await pool.query(query, [name]);
  return res.rows[0];
};

exports.getCriteria = async () => {
  const query = 'SELECT * FROM criteria';
  const res = await pool.query(query);
  return res.rows;
};