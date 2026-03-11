const express = require('express');
const router = express.Router();
const {
  submitComplaint,
  fetchComplaints,
  getAllComplaints,
  getComplaintById,
  updateComplaintStatus,
  getAPMCOptions,
  getSubjectOptions,
} = require('../controllers/complaint.controller');

/**
 * @swagger
 * /api/complaints/apmc/options:
 *   get:
 *     summary: Get APMC options
 *     tags: [Complaints]
 *     description: Retrieve list of available APMC (Agricultural Produce Market Committee) options
 *     responses:
 *       200:
 *         description: List of APMC options
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ['Mumbai APMC', 'Pune APMC', 'Nashik APMC']
 */
router.get('/apmc/options', getAPMCOptions);

/**
 * @swagger
 * /api/complaints/subject/options:
 *   get:
 *     summary: Get complaint subject options
 *     tags: [Complaints]
 *     description: Retrieve list of available complaint subject categories
 *     responses:
 *       200:
 *         description: List of subject options
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ['Price Issue', 'Quality Issue', 'Delay in Payment', 'Other']
 */
router.get('/subject/options', getSubjectOptions);

/**
 * @swagger
 * /api/complaints:
 *   post:
 *     summary: Submit a new complaint
 *     tags: [Complaints]
 *     description: Submit a new complaint to the system
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SubmitComplaintRequest'
 *     responses:
 *       201:
 *         description: Complaint submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Complaint'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *   get:
 *     summary: Get all complaints
 *     tags: [Complaints]
 *     description: Retrieve all complaints (admin only)
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, in_progress, resolved, closed]
 *         description: Filter by complaint status
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of complaints
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Complaint'
 */
router.post('/', submitComplaint);
router.get('/', getAllComplaints);

/**
 * @swagger
 * /api/complaints/user/{userId}:
 *   get:
 *     summary: Get complaints by user ID
 *     tags: [Complaints]
 *     description: Retrieve all complaints submitted by a specific user
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: List of user's complaints
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Complaint'
 */
router.get('/user/:userId', fetchComplaints);

/**
 * @swagger
 * /api/complaints/{id}:
 *   get:
 *     summary: Get complaint by ID
 *     tags: [Complaints]
 *     description: Retrieve a specific complaint by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Complaint ID
 *     responses:
 *       200:
 *         description: Complaint details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Complaint'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.get('/:id', getComplaintById);

/**
 * @swagger
 * /api/complaints/{id}/status:
 *   put:
 *     summary: Update complaint status
 *     tags: [Complaints]
 *     description: Update the status of a complaint (admin/officer only)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Complaint ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, in_progress, resolved, closed]
 *                 example: in_progress
 *     responses:
 *       200:
 *         description: Complaint status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Complaint'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.put('/:id/status', updateComplaintStatus);

module.exports = router;
