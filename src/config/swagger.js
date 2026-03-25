const swaggerJsdoc = require('swagger-jsdoc');
const { config } = require('./environment');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'AgrixServices API',
    version: '1.0.0',
    description: 'API documentation for AgrixServices - Agriculture services and complaint management system',
    contact: {
      name: 'AgrixServices Team',
      email: 'support@agrixservices.com',
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT',
    },
  },
  servers: [
    {
      url: `http://localhost:${config.port || 5000}`,
      description: 'Development server',
    },
    {
      url: 'https://agrixservices.onrender.com/',
      description: 'Production server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' },
          name: { type: 'string', example: 'John Doe' },
          mobile: { type: 'string', example: '+919876543210' },
          language: { type: 'string', example: 'en', description: 'User preferred language' },
          address: { type: 'string', example: '123 Main Street, Mumbai, Maharashtra' },
          created_at: { type: 'string', format: 'date-time', example: '2026-03-01T10:30:00Z' },
        },
      },
      Complaint: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' },
          user_id: { type: 'string', example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' },
          apmc_name: { type: 'string', example: 'Mumbai APMC' },
          subject: { type: 'string', example: 'Price Issue' },
          description: { type: 'string', example: 'Incorrect pricing for wheat' },
          status: { type: 'string', enum: ['PENDING', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'], example: 'PENDING' },
          created_at: { type: 'string', format: 'date-time' },
          updated_at: { type: 'string', format: 'date-time' },
        },
      },
      News: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' },
          title: { type: 'string', example: 'New Agricultural Policy Announced' },
          description: { type: 'string', example: 'Government announces new subsidy scheme' },
          content: { type: 'string', example: 'The government has announced...' },
          category: { type: 'string', example: 'Government Schemes' },
          author: { type: 'string', example: 'Admin' },
          image_url: { type: 'string', format: 'uri', example: 'https://example.com/image.jpg' },
          source: { type: 'string', example: 'Agriculture India' },
          url: { type: 'string', format: 'uri', example: 'https://example.com/news/article' },
          published_at: { type: 'string', format: 'date-time' },
          created_at: { type: 'string', format: 'date-time' },
        },
      },
      LoginRequest: {
        type: 'object',
        required: ['mobile'],
        properties: {
          mobile: {
            type: 'string',
            example: '+919876543210',
            description: 'Mobile number with country code',
          },
        },
      },
      LoginResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string', example: 'OTP sent successfully' },
          userId: { type: 'string', example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' },
          mobile: { type: 'string', example: '+919876543210' },
          requiresOTP: { type: 'boolean', example: true },
        },
      },
      SignUpRequest: {
        type: 'object',
        required: ['name', 'mobile'],
        properties: {
          name: { type: 'string', example: 'John Doe' },
          mobile: { type: 'string', example: '+919876543210' },
          language: { type: 'string', example: 'en', description: 'User preferred language (default: en)' },
          address: { type: 'string', example: '123 Main Street, Mumbai, Maharashtra' },
        },
      },
      VerifyOTPRequest: {
        type: 'object',
        required: ['userId', 'mobile', 'otp'],
        properties: {
          userId: { type: 'string', example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' },
          mobile: { type: 'string', example: '+919876543210' },
          otp: { type: 'string', example: '123456' },
        },
      },
      SubmitComplaintRequest: {
        type: 'object',
        required: ['apmc', 'subject', 'description'],
        description: 'userId is taken from the authenticated JWT — do not send it in the body',
        properties: {
          apmc: { type: 'string', example: 'Mumbai APMC' },
          subject: { type: 'string', example: 'Price Issue' },
          description: { type: 'string', example: 'Incorrect pricing for wheat' },
        },
      },

      Error: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          error: { type: 'string', example: 'Error message' },
        },
      },
      Success: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          data: { type: 'object' },
        },
      },
    },
    responses: {
      UnauthorizedError: {
        description: 'Access token is missing or invalid',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error',
            },
          },
        },
      },
      NotFoundError: {
        description: 'Resource not found',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error',
            },
          },
        },
      },
      ValidationError: {
        description: 'Validation error',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error',
            },
          },
        },
      },
      ForbiddenError: {
        description: 'Forbidden — you do not have permission to access this resource',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error',
            },
          },
        },
      },
    },
  },
  tags: [
    {
      name: 'Authentication',
      description: 'User authentication endpoints',
    },
    {
      name: 'Users',
      description: 'User management endpoints',
    },
    {
      name: 'Complaints',
      description: 'Complaint submission and management endpoints',
    },
    {
      name: 'News',
      description: 'News articles management endpoints',
    },
  ],
  security: [{ bearerAuth: [] }],
};

const options = {
  definition: swaggerDefinition,
  // Path to the API routes
  apis: ['./src/routes/*.js', './src/controllers/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
