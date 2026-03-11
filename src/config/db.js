const { Pool } = require('pg');

let pool = null;

// Parse DATABASE_URL to ensure password is a string
const getDatabaseConfig = () => {
  console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Found' : 'NOT FOUND');
  console.log('All env keys:', Object.keys(process.env).filter(k => k.includes('DATABASE')));
  
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is required in environment variables. Make sure .env.development is loaded.');
  }
  
  try {
    const url = new URL(process.env.DATABASE_URL);
    const isSupabase = url.hostname.includes('supabase.co');
    
    return {
      user: url.username,
      password: String(url.password), // Ensure password is a string
      host: url.hostname,
      port: parseInt(url.port) || 5432,
      database: url.pathname.slice(1),
      ssl: (process.env.NODE_ENV === 'production' || isSupabase) 
        ? { rejectUnauthorized: false } 
        : false,
    };
  } catch (error) {
    console.error('Invalid DATABASE_URL format:', process.env.DATABASE_URL);
    throw error;
  }
};

// Lazy initialization of pool
const getPool = () => {
  if (!pool) {
    pool = new Pool(getDatabaseConfig());
  }
  return pool;
};

const connectDB = async () => {
  try {
    const dbPool = getPool();
    const client = await dbPool.connect();
    const config = getDatabaseConfig();
    console.log(`PostgreSQL Connected: ${config.host}:${config.port}/${config.database}`);
    client.release();
  } catch (error) {
    console.error(`Database Connection Error: ${error.message}`);
    process.exit(1);
  }
};

// Export pool as a getter to ensure lazy initialization
module.exports = { 
  connectDB, 
  get pool() {
    return getPool();
  }
};
