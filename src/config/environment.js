const path = require('path');
const dotenv = require('dotenv');
const fs = require('fs');

// Load environment-specific .env file
const loadEnvironment = () => {
  const env = process.env.NODE_ENV || 'development';
  const envFile = `.env.${env}`;
  const envPath = path.resolve(process.cwd(), envFile);
  
  console.log(`Attempting to load: ${envPath}`);
  console.log(`File exists: ${fs.existsSync(envPath)}`);
  
  const result = dotenv.config({ path: envPath });
  
  if (result.error) {
    console.warn(`Warning: Could not load ${envFile}, falling back to .env`);
    const fallbackPath = path.resolve(process.cwd(), '.env');
    console.log(`Fallback path: ${fallbackPath}`);
    console.log(`Fallback exists: ${fs.existsSync(fallbackPath)}`);
    dotenv.config();
  } else {
    console.log(`✓ Loaded environment from ${envFile}`);
  }
  
  // Debug: Show what was loaded
  console.log('DATABASE_URL loaded:', process.env.DATABASE_URL ? 'YES' : 'NO');
};

// Configuration object
const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 5000,
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpire: process.env.JWT_EXPIRE || '30d',
  corsOrigin: process.env.CORS_ORIGIN || '*',
  logLevel: process.env.LOG_LEVEL || 'info',
};

// Validate required environment variables
const validateConfig = () => {
  const required = ['DATABASE_URL', 'JWT_SECRET'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
};

module.exports = {
  loadEnvironment,
  validateConfig,
  config,
};
