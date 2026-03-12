const complaintService = require('../services/complaint.service');

// @desc    Submit a new complaint
// @route   POST /api/complaints
// @access  Private
const submitComplaint = async (req, res, next) => {
  try {
    const { apmc, subject, description, userid } = req.body;
    
    if (!apmc || !subject || !description || !userid) {
      return res.status(400).json({
        success: false,
        message: 'APMC, subject, description, and userId are required',
      });
    }
    
    const complaint = await complaintService.submitComplaint({
      apmc,
      subject,
      description,
      userId,
    });
    
    res.status(201).json({
      success: true,
      message: 'Complaint submitted successfully',
      data: complaint,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Fetch all complaints for a user
// @route   GET /api/complaints/user/:userId
// @access  Private
const fetchComplaints = async (req, res, next) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required',
      });
    }
    
    const complaints = await complaintService.fetchComplaints(userId);
    
    res.status(200).json({
      success: true,
      data: complaints,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all complaints (admin)
// @route   GET /api/complaints
// @access  Private/Admin
const getAllComplaints = async (req, res, next) => {
  try {
    const { status } = req.query;
    
    const complaints = await complaintService.getAllComplaints(status);
    
    res.status(200).json({
      success: true,
      data: complaints,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get complaint by ID
// @route   GET /api/complaints/:id
// @access  Private
const getComplaintById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const complaint = await complaintService.getComplaintById(id);
    
    res.status(200).json({
      success: true,
      data: complaint,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update complaint status
// @route   PUT /api/complaints/:id/status
// @access  Private/Admin
const updateComplaintStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required',
      });
    }
    
    const complaint = await complaintService.updateComplaintStatus(id, status);
    
    res.status(200).json({
      success: true,
      message: 'Complaint status updated successfully',
      data: complaint,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get APMC options
// @route   GET /api/complaints/apmc/options
// @access  Public
const getAPMCOptions = async (req, res, next) => {
  try {
    const apmcOptions = await complaintService.getAPMCOptions();
    
    res.status(200).json({
      success: true,
      data: apmcOptions,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get subject options
// @route   GET /api/complaints/subject/options
// @access  Public
const getSubjectOptions = async (req, res, next) => {
  try {
    const subjectOptions = await complaintService.getSubjectOptions();
    
    res.status(200).json({
      success: true,
      data: subjectOptions,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitComplaint,
  fetchComplaints,
  getAllComplaints,
  getComplaintById,
  updateComplaintStatus,
  getAPMCOptions,
  getSubjectOptions,
};
