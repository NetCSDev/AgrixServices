const { loadEnvironment, validateConfig, config } = require('./config/environment');

// Load environment variables FIRST before importing anything else
loadEnvironment();

const app = require('./app');
const { connectDB } = require('./config/db');

// Validate configuration
try {
  validateConfig();
} catch (error) {
  console.error(error.message);
  process.exit(1);
}

// Connect to database
connectDB();

const server = app.listen(config.port, () => {
  console.log(`Server running in ${config.env} mode on port ${config.port}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
