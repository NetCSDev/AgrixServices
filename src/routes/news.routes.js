const express = require('express');
const router = express.Router();
const {
  fetchNewsArticles,
  searchNewsArticles,
  fetchNewsByCategory,
  getNewsById,
  createNewsArticle,
  updateNewsArticle,
  deleteNewsArticle,
  getCategories,
} = require('../controllers/news.controller');

/**
 * @swagger
 * /api/news/meta/categories:
 *   get:
 *     summary: Get news categories
 *     tags: [News]
 *     description: Retrieve list of available news categories
 *     responses:
 *       200:
 *         description: List of news categories
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
 *                   example: ['policy', 'weather', 'market', 'technology', 'general']
 */
router.get('/meta/categories', getCategories);

/**
 * @swagger
 * /api/news/search:
 *   get:
 *     summary: Search news articles
 *     tags: [News]
 *     description: Search for news articles by keyword
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Search query
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Search results with pagination
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
 *                     $ref: '#/components/schemas/News'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     pageSize:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                     totalItems:
 *                       type: integer
 *                     hasMore:
 *                       type: boolean
 */
router.get('/search', searchNewsArticles);

/**
 * @swagger
 * /api/news/category/{category}:
 *   get:
 *     summary: Get news by category
 *     tags: [News]
 *     description: Retrieve news articles filtered by category
 *     parameters:
 *       - in: path
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *         description: News category
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of news articles in the category with pagination
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
 *                     $ref: '#/components/schemas/News'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     pageSize:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                     totalItems:
 *                       type: integer
 *                     hasMore:
 *                       type: boolean
 */
router.get('/category/:category', fetchNewsByCategory);

/**
 * @swagger
 * /api/news:
 *   get:
 *     summary: Get all news articles
 *     tags: [News]
 *     description: Retrieve all news articles with pagination and optional filters
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number (starts from 1)
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search text in title, description, or content
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *     responses:
 *       200:
 *         description: List of news articles with pagination metadata
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
 *                     $ref: '#/components/schemas/News'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     pageSize:
 *                       type: integer
 *                       example: 10
 *                     totalPages:
 *                       type: integer
 *                       example: 5
 *                     totalItems:
 *                       type: integer
 *                       example: 47
 *                     hasMore:
 *                       type: boolean
 *                       example: true
 *                   items:
 *                     $ref: '#/components/schemas/News'
 *   post:
 *     summary: Create a news article
 *     tags: [News]
 *     description: Create a new news article (admin only)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *               - category
 *             properties:
 *               title:
 *                 type: string
 *                 example: New Agricultural Policy Announced
 *               content:
 *                 type: string
 *                 example: The government has announced a new agricultural policy...
 *               category:
 *                 type: string
 *                 example: policy
 *               author:
 *                 type: string
 *                 example: Admin
 *               image_url:
 *                 type: string
 *                 format: uri
 *                 example: https://example.com/image.jpg
 *     responses:
 *       201:
 *         description: News article created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/News'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 */
router.get('/', fetchNewsArticles);
router.post('/', createNewsArticle);

/**
 * @swagger
 * /api/news/{id}:
 *   get:
 *     summary: Get news article by ID
 *     tags: [News]
 *     description: Retrieve a specific news article by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: News article ID
 *     responses:
 *       200:
 *         description: News article details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/News'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *   put:
 *     summary: Update news article
 *     tags: [News]
 *     description: Update an existing news article (admin only)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: News article ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               category:
 *                 type: string
 *               author:
 *                 type: string
 *               image_url:
 *                 type: string
 *                 format: uri
 *     responses:
 *       200:
 *         description: News article updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/News'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *   delete:
 *     summary: Delete news article
 *     tags: [News]
 *     description: Delete a news article (admin only)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: News article ID
 *     responses:
 *       200:
 *         description: News article deleted successfully
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
 *                   example: News article deleted successfully
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.get('/:id', getNewsById);
router.put('/:id', updateNewsArticle);
router.delete('/:id', deleteNewsArticle);

module.exports = router;
