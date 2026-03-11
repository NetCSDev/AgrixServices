const { pool } = require('../config/db');

// User service - Business logic layer

const getAllUsers = async () => {
  const result = await pool.query('SELECT id, name, mobile, language, address, created_at as "createdAt" FROM users ORDER BY created_at DESC');
  return result.rows;
};

const getUserById = async (id) => {
  const result = await pool.query('SELECT id, name, mobile, language, address, created_at as "createdAt" FROM users WHERE id = $1', [id]);
  
  if (result.rows.length === 0) {
    throw new Error('User not found');
  }
  
  return result.rows[0];
};

const createUser = async (userData) => {
  const { name, mobile, language, address } = userData;
  
  const result = await pool.query(
    'INSERT INTO users (name, mobile, language, address) VALUES ($1, $2, $3, $4) RETURNING id, name, mobile, language, address, created_at as "createdAt"',
    [name, mobile, language || 'en', address]
  );
  
  return result.rows[0];
};

const updateUser = async (id, userData) => {
  const { name, mobile, language, address } = userData;
  
  const result = await pool.query(
    'UPDATE users SET name = $1, mobile = $2, language = $3, address = $4 WHERE id = $5 RETURNING id, name, mobile, language, address, created_at as "createdAt"',
    [name, mobile, language, address, id]
  );
  
  if (result.rows.length === 0) {
    throw new Error('User not found');
  }
  
  return result.rows[0];
};

const deleteUser = async (id) => {
  const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
  
  if (result.rows.length === 0) {
    throw new Error('User not found');
  }
  
  return result.rows[0];
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
