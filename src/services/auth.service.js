const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');
const smsService = require('./sms.service');
const { config } = require('../config/environment');

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// OTP expires in 10 minutes
const OTP_EXPIRY_MINUTES = 10;

/**
 * Login with mobile number
 * Creates user if doesn't exist, generates and stores OTP
 */
const login = async (mobile) => {
  // Check if user exists
  let result = await pool.query('SELECT id, mobile, name FROM users WHERE mobile = $1', [mobile]);
  
  let user;
  let isNewUser = false;
  
  if (result.rows.length === 0) {
    // User doesn't exist - they need to sign up first
    throw new Error('User not found. Please sign up first.');
  } else {
    user = result.rows[0];
  }
  
  // Generate OTP
  const otp = generateOTP();
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);
  
  // Store OTP in database
  await pool.query(
    `INSERT INTO otp_verifications (user_id, mobile, otp, expires_at) 
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (user_id) 
     DO UPDATE SET otp = $3, expires_at = $4, created_at = CURRENT_TIMESTAMP, is_verified = false`,
    [user.id, mobile, otp, expiresAt]
  );

  // send OTP via Fast2SMS (non-blocking)
  try {
    await smsService.sendOTP(mobile, otp);
  } catch (err) {
    console.error('Failed to send OTP via SMS service:', err.message || err);
    // Continue anyway; OTP is stored and will work if user manually enters it
  }

  return {
    userId: user.id,
    mobile: user.mobile,
    requiresOTP: true,
  };
};

/**
 * Sign up with user details
 */
const signUp = async ({ mobile, name, language, address }) => {
  // Check if user already exists
  const existingUser = await pool.query('SELECT id FROM users WHERE mobile = $1', [mobile]);
  
  if (existingUser.rows.length > 0) {
    throw new Error('User with this mobile number already exists');
  }
  
  // Create user
  const result = await pool.query(
    `INSERT INTO users (name, mobile, language, address) 
     VALUES ($1, $2, $3, $4) 
     RETURNING id, mobile, name, language, address, created_at as "createdAt"`,
    [name, mobile, language || 'en', address || null]
  );
  
  const user = result.rows[0];
  
  // Generate OTP
  const otp = generateOTP();
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);
  
  // Store OTP
  await pool.query(
    `INSERT INTO otp_verifications (user_id, mobile, otp, expires_at) 
     VALUES ($1, $2, $3, $4)`,
    [user.id, mobile, otp, expiresAt]
  );

  // send OTP via SMS service
  try {
    await smsService.sendOTP(mobile, otp);
  } catch (err) {
    console.error('Failed to send OTP via SMS service:', err.message || err);
  }

  return {
    userId: user.id,
    mobile: user.mobile,
    name: user.name,
    language: user.language,
    address: user.address,
  };
};

/**
 * Verify OTP
 */
const verifyOTP = async (userId, mobile, otp) => {
  // Get OTP record
  const result = await pool.query(
    `SELECT * FROM otp_verifications 
     WHERE user_id = $1 AND mobile = $2 AND is_verified = false`,
    [userId, mobile]
  );
  
  if (result.rows.length === 0) {
    throw new Error('Invalid OTP or already verified');
  }
  
  const otpRecord = result.rows[0];
  
  // Check if OTP is expired
  if (new Date() > new Date(otpRecord.expires_at)) {
    throw new Error('OTP has expired');
  }
  
  // Verify OTP
  if (otpRecord.otp !== otp) {
    throw new Error('Invalid OTP');
  }
  
  // Mark as verified
  await pool.query(
    'UPDATE otp_verifications SET is_verified = true WHERE user_id = $1',
    [userId]
  );
  
  // Get user details
  const userResult = await pool.query(
    'SELECT id, name, mobile, language, address, created_at as "createdAt" FROM users WHERE id = $1',
    [userId]
  );
  
  const user = userResult.rows[0];
  
  // Sign JWT with user identity
  const token = jwt.sign(
    { id: user.id, mobile: user.mobile },
    config.jwtSecret,
    { expiresIn: config.jwtExpire }
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      mobile: user.mobile,
      language: user.language,
      address: user.address,
      createdAt: user.createdAt,
    },
  };
};

/**
 * Resend OTP
 */
const resendOTP = async (userId, mobile) => {
  // Verify user exists
  const userResult = await pool.query(
    'SELECT id FROM users WHERE id = $1 AND mobile = $2',
    [userId, mobile]
  );
  
  if (userResult.rows.length === 0) {
    throw new Error('User not found');
  }
  
  // Generate new OTP
  const otp = generateOTP();
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);
  
  // Update OTP in database
  await pool.query(
    `INSERT INTO otp_verifications (user_id, mobile, otp, expires_at) 
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (user_id) 
     DO UPDATE SET otp = $3, expires_at = $4, created_at = CURRENT_TIMESTAMP, is_verified = false`,
    [userId, mobile, otp, expiresAt]
  );
  
  // send OTP via SMS service
  try {
    await smsService.sendOTP(mobile, otp);
  } catch (err) {
    console.error('Failed to send OTP via SMS service:', err.message || err);
  }

  return true;
};

module.exports = {
  login,
  signUp,
  verifyOTP,
  resendOTP,
};
