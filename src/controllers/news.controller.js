const newsService = require('../services/news.service');

// @desc    Fetch news articles with pagination and filters
// @route   GET /api/news
// @access  Public
const fetchNewsArticles = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const search = req.query.search;
    const category = req.query.category;
    
    const result = await newsService.fetchNewsArticles(page, pageSize, { search, category });
    
    res.status(200).json({
      success: true,
      data: result.articles,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Search news articles
// @route   GET /api/news/search
// @access  Public
const searchNewsArticles = async (req, res, next) => {
  try {
    const query = req.query.q;
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required',
      });
    }
    
    const result = await newsService.searchNewsArticles(query, page, pageSize);
    
    res.status(200).json({
      success: true,
      data: result.articles,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Fetch news by category
// @route   GET /api/news/category/:category
// @access  Public
const fetchNewsByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    
    const result = await newsService.fetchNewsByCategory(category, page, pageSize);
    
    res.status(200).json({
      success: true,
      data: result.articles,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get news article by ID
// @route   GET /api/news/:id
// @access  Public
const getNewsById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const article = await newsService.getNewsById(id);
    
    res.status(200).json({
      success: true,
      data: article,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create news article
// @route   POST /api/news
// @access  Private/Admin
const createNewsArticle = async (req, res, next) => {
  try {
    const { title, description, content, imageUrl, source, author, url, category, tags } = req.body;
    
    if (!title || !description || !content || !source || !url) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, content, source, and URL are required',
      });
    }
    
    const article = await newsService.createNewsArticle({
      title,
      description,
      content,
      imageUrl,
      source,
      author,
      url,
      category,
      tags,
    });
    
    res.status(201).json({
      success: true,
      message: 'News article created successfully',
      data: article,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update news article
// @route   PUT /api/news/:id
// @access  Private/Admin
const updateNewsArticle = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, content, imageUrl, source, author, url, category, tags } = req.body;
    
    const article = await newsService.updateNewsArticle(id, {
      title,
      description,
      content,
      imageUrl,
      source,
      author,
      url,
      category,
      tags,
    });
    
    res.status(200).json({
      success: true,
      message: 'News article updated successfully',
      data: article,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete news article
// @route   DELETE /api/news/:id
// @access  Private/Admin
const deleteNewsArticle = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    await newsService.deleteNewsArticle(id);
    
    res.status(200).json({
      success: true,
      message: 'News article deleted successfully',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get available categories
// @route   GET /api/news/meta/categories
// @access  Public
const getCategories = async (req, res, next) => {
  try {
    const categories = await newsService.getCategories();
    
    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
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
