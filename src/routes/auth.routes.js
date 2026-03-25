const express = require('express');
const router = express.Router();
const {
  login,
  signUp,
  verifyOTP,
  resendOTP,
} = require('../controllers/auth.controller');

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login with mobile number
 *     tags: [Authentication]
 *     security: []
 *     description: Send OTP to the provided mobile number for authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: OTP sent successfully (includes userId for verification)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 */
router.post('/login', login);

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     security: []
 *     description: Create a new user account and send OTP for verification
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SignUpRequest'
 *     responses:
 *       201:
 *         description: User registered successfully, OTP sent
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: User registered. OTP sent to mobile number
 *                 userId:
 *                   type: string
 *                   example: a1b2c3d4-e5f6-7890-abcd-ef1234567890
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 */
router.post('/signup', signUp);

/**
 * @swagger
 * /api/auth/verify-otp:
 *   post:
 *     summary: Verify OTP
 *     tags: [Authentication]
 *     security: []
 *     description: >
 *       Verify the 6-digit OTP sent to the user's mobile number.
 *       On success, returns a signed JWT token valid for 30 days.
 *       Use the token as `Authorization: Bearer <token>` on all protected routes.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - mobile
 *               - otp
 *             properties:
 *               userId:
 *                 type: string
 *                 description: User ID returned by /login or /signup
 *                 example: a1b2c3d4-e5f6-7890-abcd-ef1234567890
 *               mobile:
 *                 type: string
 *                 description: Mobile number used during login/signup
 *                 example: '+919876543210'
 *               otp:
 *                 type: string
 *                 description: 6-digit OTP received via SMS
 *                 example: '123456'
 *           example:
 *             userId: a1b2c3d4-e5f6-7890-abcd-ef1234567890
 *             mobile: '+919876543210'
 *             otp: '123456'
 *     responses:
 *       200:
 *         description: OTP verified — JWT token issued
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: OTP verified successfully
 *                 token:
 *                   type: string
 *                   description: JWT Bearer token — expires in 30 days
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.post('/verify-otp', verifyOTP);

/**
 * @swagger
 * /api/auth/resend-otp:
 *   post:
 *     summary: Resend OTP
 *     tags: [Authentication]
 *     security: []
 *     description: Resend OTP to the user's mobile number
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - mobile
 *             properties:
 *               userId:
 *                 type: string
 *                 example: a1b2c3d4-e5f6-7890-abcd-ef1234567890
 *               mobile:
 *                 type: string
 *                 example: '+919876543210'
 *     responses:
 *       200:
 *         description: OTP resent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: OTP resent to mobile number
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 */
router.post('/resend-otp', resendOTP);

module.exports = router;
