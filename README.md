# AgrixServices API

Node.js API for Agrix Services with multiple environment support.

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Setup PostgreSQL database:
   - Create a database: `createdb agrixservices_dev`
   - Update `.env.development` with your DATABASE_URL
   - Run migration: `npm run migrate`

3. Configure environment variables:
   - Copy the appropriate `.env.{environment}` file
   - Update the DATABASE_URL with your PostgreSQL credentials
   - Make sure to change JWT_SECRET and database credentials

### Running the Application

#### Development
```bash
npm run dev
```
Runs the server with `.env.development` configuration on port 5000 with nodemon for auto-restart.

#### Staging
```bash
npm run staging
```
Runs the server with `.env.staging` configuration.

#### Production
```bash
npm run prod
```
Runs the server with `.env.production` configuration.

## Environment Configuration

The application supports three environments:

- **Development** (`.env.development`) - Local development with debug logging
- **Staging** (`.env.staging`) - Pre-production testing environment
- **Production** (`.env.production`) - Live production environment

### Environment Variables

Each environment file should contain:

```env
NODE_ENV=development|staging|production
PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/database_name

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRE=30d

# CORS
CORS_ORIGIN=http://localhost:3000

# Logging
LOG_LEVEL=debug|info|error
```

## Project Structure

```
agrixservices/
├── src/
│   ├── config/
│   │   ├── db.js              # PostgreSQL connection
│   │   ├── schema.sql         # Database schema
│   │   ├── environment.js     # Environment loader
│   │   └── swagger.js         # OpenAPI/Swagger configuration
│   ├── controllers/
│   │   └── user.controller.js
│   ├── routes/
│   │   └── user.routes.js
│   ├── services/
│   │   └── user.service.js
│   ├── middlewares/
│   │   └── error.middleware.js
│   ├── app.js                 # Express app setup
│   └── server.js              # Server entry point
├── .env.development           # Development config
├── .env.staging              # Staging config
├── .env.production           # Production config
├── .gitignore
└── package.json
```

## Environment Variables

The application relies on a few environment variables defined in `.env` files (loaded based on `NODE_ENV`).

- `DATABASE_URL`   – PostgreSQL connection string (required)
- `JWT_SECRET`     – Secret for JWT tokens (required)
- `CORS_ORIGIN`    – Allowed CORS origin(s)
- `FAST2SMS_API_KEY` – (optional) API key for Fast2SMS service. When provided, OTPs will be sent via SMS. If missing, OTPs will be logged to console for development.
  > **Note:** Fast2SMS requires you to verify your website/app before you can use the OTP Message API. If you see a 400 error complaining about website verification, either complete the process in the Fast2SMS dashboard or switch to the DLT SMS API.
- `FAST2SMS_SENDER_ID` – (optional) Sender ID to use (default: `IGNYX`).
- `FAST2SMS_ROUTE`  – (optional) Route for SMS requests (`otp`, `q`, or `dlt`; default `otp`).

Environment files `.env.development`, `.env.staging`, `.env.production` are used depending on `NODE_ENV`.

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login with mobile number (sends OTP) and returns a `userId` used for OTP verification
- `POST /api/auth/signup` - Sign up with user details (sends OTP)
- `POST /api/auth/verify-otp` - Verify OTP and complete authentication
- `POST /api/auth/resend-otp` - Resend OTP

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Complaints
- `POST /api/complaints` - Submit a new complaint
- `GET /api/complaints/user/:userId` - Get all complaints for a user
- `GET /api/complaints` - Get all complaints (with optional status filter)
- `GET /api/complaints/:id` - Get complaint by ID
- `PUT /api/complaints/:id/status` - Update complaint status
- `GET /api/complaints/apmc/options` - Get APMC options
- `GET /api/complaints/subject/options` - Get subject options

### News Articles
- `GET /api/news` - Get news articles with pagination (page, pageSize, search, category filters)
- `GET /api/news/search?q=query` - Search news articles
- `GET /api/news/category/:category` - Get news by category
- `GET /api/news/:id` - Get news article by ID
- `POST /api/news` - Create news article (Admin)
- `PUT /api/news/:id` - Update news article (Admin)
- `DELETE /api/news/:id` - Delete news article (Admin)
- `GET /api/news/meta/categories` - Get available categories

## API Documentation

### Interactive OpenAPI (Swagger) Documentation

The API is fully documented using OpenAPI 3.0 specification. You can view and test all endpoints interactively using Swagger UI.

**Access the documentation:**
- Start the development server: `npm run dev`
- Open your browser and navigate to: `http://localhost:5000/api-docs`

**Features:**
- 📋 Complete API reference with all endpoints
- 🧪 Interactive "Try it out" functionality to test endpoints directly
- 📝 Request/response schemas and examples
- 🏷️ Organized by tags (Authentication, Users, Complaints, News)
- 🔍 Search and explore API endpoints

**OpenAPI Specification JSON:**
- Access the raw OpenAPI spec at: `http://localhost:5000/api-docs.json`
- Use this with other OpenAPI tools like Postman, Insomnia, or code generators

See [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for detailed API documentation.

## Security Notes

⚠️ **Important**: 
- Never commit `.env` files with real credentials to version control
- Change all default JWT_SECRET values before deployment
- Use strong, unique secrets for each environment
- Keep production credentials secure and separate
