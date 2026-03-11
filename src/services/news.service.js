const { pool } = require('../config/db');

/**
 * Fetch news articles with pagination and filters
 */
const fetchNewsArticles = async (page = 1, pageSize = 10, filters = {}) => {
  const offset = (page - 1) * pageSize;
  const { search, category } = filters;
  
  let query = `
    SELECT id, title, description, content, image_url as "imageUrl", 
           source, author, published_at as "publishedAt", url, category, tags
    FROM news_articles
    WHERE 1=1
  `;
  
  const params = [];
  let paramIndex = 1;
  
  // Add search filter
  if (search) {
    query += ` AND (title ILIKE $${paramIndex} OR description ILIKE $${paramIndex} OR content ILIKE $${paramIndex})`;
    params.push(`%${search}%`);
    paramIndex++;
  }
  
  // Add category filter
  if (category) {
    query += ` AND category = $${paramIndex}`;
    params.push(category);
    paramIndex++;
  }
  
  // Get total count
  const countQuery = `SELECT COUNT(*) FROM news_articles WHERE 1=1` +
    (search ? ` AND (title ILIKE $1 OR description ILIKE $1 OR content ILIKE $1)` : '') +
    (category ? ` AND category = $${search ? 2 : 1}` : '');
  
  const countResult = await pool.query(countQuery, params);
  const totalItems = parseInt(countResult.rows[0].count);
  const totalPages = Math.ceil(totalItems / pageSize);
  
  // Add ordering and pagination
  query += ` ORDER BY published_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
  params.push(pageSize, offset);
  
  const result = await pool.query(query, params);
  
  return {
    articles: result.rows,
    pagination: {
      page,
      pageSize,
      totalPages,
      totalItems,
      hasMore: page < totalPages,
    },
  };
};

/**
 * Search news articles
 */
const searchNewsArticles = async (query, page = 1, pageSize = 10) => {
  return fetchNewsArticles(page, pageSize, { search: query });
};

/**
 * Fetch news by category
 */
const fetchNewsByCategory = async (category, page = 1, pageSize = 10) => {
  return fetchNewsArticles(page, pageSize, { category });
};

/**
 * Get news article by ID
 */
const getNewsById = async (id) => {
  const result = await pool.query(
    `SELECT id, title, description, content, image_url as "imageUrl", 
            source, author, published_at as "publishedAt", url, category, tags
     FROM news_articles 
     WHERE id = $1`,
    [id]
  );
  
  if (result.rows.length === 0) {
    throw new Error('News article not found');
  }
  
  return result.rows[0];
};

/**
 * Create news article
 */
const createNewsArticle = async (articleData) => {
  const { title, description, content, imageUrl, source, author, url, category, tags } = articleData;
  
  const result = await pool.query(
    `INSERT INTO news_articles (title, description, content, image_url, source, author, url, category, tags, published_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, CURRENT_TIMESTAMP)
     RETURNING id, title, description, content, image_url as "imageUrl", 
               source, author, published_at as "publishedAt", url, category, tags`,
    [title, description, content, imageUrl || null, source, author || null, url, category || null, tags || null]
  );
  
  return result.rows[0];
};

/**
 * Update news article
 */
const updateNewsArticle = async (id, articleData) => {
  const { title, description, content, imageUrl, source, author, url, category, tags } = articleData;
  
  const result = await pool.query(
    `UPDATE news_articles 
     SET title = $1, description = $2, content = $3, image_url = $4, 
         source = $5, author = $6, url = $7, category = $8, tags = $9
     WHERE id = $10
     RETURNING id, title, description, content, image_url as "imageUrl", 
               source, author, published_at as "publishedAt", url, category, tags`,
    [title, description, content, imageUrl, source, author, url, category, tags, id]
  );
  
  if (result.rows.length === 0) {
    throw new Error('News article not found');
  }
  
  return result.rows[0];
};

/**
 * Delete news article
 */
const deleteNewsArticle = async (id) => {
  const result = await pool.query(
    'DELETE FROM news_articles WHERE id = $1 RETURNING id',
    [id]
  );
  
  if (result.rows.length === 0) {
    throw new Error('News article not found');
  }
  
  return result.rows[0];
};

/**
 * Get available categories
 */
const getCategories = async () => {
  const result = await pool.query(
    `SELECT DISTINCT category 
     FROM news_articles 
     WHERE category IS NOT NULL 
     ORDER BY category`
  );
  
  return result.rows.map(row => row.category);
};

module.exports = {
  fetchNewsArticles,
  searchNewsArticles,
  fetchNewsByCategory,
  getNewsById,
  createNewsArticle,
  updateNewsArticle,
  deleteNewsArticle,
  getCategories,
};
