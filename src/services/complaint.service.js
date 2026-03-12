const { pool } = require('../config/db');

// Complaint Status Enum
const ComplaintStatus = {
  PENDING: 'PENDING',
  IN_PROGRESS: 'IN_PROGRESS',
  RESOLVED: 'RESOLVED',
  REJECTED: 'REJECTED',
};

/**
 * Submit a new complaint
 */
const submitComplaint = async ({ apmc, subject, description, userid }) => {
  const result = await pool.query(
    `INSERT INTO complaints (apmc, subject, description, status, user_id) 
     VALUES ($1, $2, $3, $4, $5) 
     RETURNING id, apmc, subject, description, status, 
               created_at as "createdAt", updated_at as "updatedAt", user_id as "userId"`,
    [apmc, subject, description, ComplaintStatus.PENDING, userid]
  );
  
  return result.rows[0];
};

/**
 * Fetch all complaints for a specific user
 */
const fetchComplaints = async (userid) => {
  const result = await pool.query(
    `SELECT id, apmc, subject, description, status, 
            created_at as "createdAt", updated_at as "updatedAt", user_id as "userId"
     FROM complaints 
     WHERE user_id = $1 
     ORDER BY created_at DESC`,
    [userid]
  );
  
  return result.rows;
};

/**
 * Get all complaints (with optional status filter)
 */
const getAllComplaints = async (status) => {
  let query = `SELECT c.id, c.apmc, c.subject, c.description, c.status, 
                      c.created_at as "createdAt", c.updated_at as "updatedAt", 
                      c.user_id as "userId",
                      u.name as "userName", u.mobile as "userMobile"
               FROM complaints c
               LEFT JOIN users u ON c.user_id = u.id`;
  
  const params = [];
  
  if (status) {
    query += ' WHERE c.status = $1';
    params.push(status);
  }
  
  query += ' ORDER BY c.created_at DESC';
  
  const result = await pool.query(query, params);
  return result.rows;
};

/**
 * Get complaint by ID
 */
const getComplaintById = async (id) => {
  const result = await pool.query(
    `SELECT c.id, c.apmc, c.subject, c.description, c.status, 
            c.created_at as "createdAt", c.updated_at as "updatedAt", 
            c.user_id as "userId",
            u.name as "userName", u.mobile as "userMobile"
     FROM complaints c
     LEFT JOIN users u ON c.user_id = u.id
     WHERE c.id = $1`,
    [id]
  );
  
  if (result.rows.length === 0) {
    throw new Error('Complaint not found');
  }
  
  return result.rows[0];
};

/**
 * Update complaint status
 */
const updateComplaintStatus = async (id, status) => {
  // Validate status
  if (!Object.values(ComplaintStatus).includes(status)) {
    throw new Error(`Invalid status. Must be one of: ${Object.values(ComplaintStatus).join(', ')}`);
  }
  
  const result = await pool.query(
    `UPDATE complaints 
     SET status = $1, updated_at = CURRENT_TIMESTAMP 
     WHERE id = $2 
     RETURNING id, apmc, subject, description, status, 
               created_at as "createdAt", updated_at as "updatedAt", user_id as "userId"`,
    [status, id]
  );
  
  if (result.rows.length === 0) {
    throw new Error('Complaint not found');
  }
  
  return result.rows[0];
};

/**
 * Get APMC options
 */
const getAPMCOptions = async () => {
  const result = await pool.query(
    'SELECT id, name FROM apmc ORDER BY name'
  );
  
  return result.rows;
};

/**
 * Get subject options
 */
const getSubjectOptions = async () => {
  const result = await pool.query(
    'SELECT id, name FROM subjects ORDER BY name'
  );
  
  return result.rows;
};

module.exports = {
  submitComplaint,
  fetchComplaints,
  getAllComplaints,
  getComplaintById,
  updateComplaintStatus,
  getAPMCOptions,
  getSubjectOptions,
  ComplaintStatus,
};
