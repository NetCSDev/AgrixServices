const authService = require('../services/auth.service');

// @desc    Login with mobile number
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { mobile } = req.body;
    
    if (!mobile) {
      return res.status(400).json({
        success: false,
        message: 'Mobile number is required',
      });
    }
    
    const result = await authService.login(mobile);
    
    res.status(200).json({
      success: true,
      message: 'OTP sent successfully',
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Sign up with user details
// @route   POST /api/auth/signup
// @access  Public
const signUp = async (req, res, next) => {
  try {
    const { mobile, name, language, address } = req.body;
    
    if (!mobile || !name) {
      return res.status(400).json({
        success: false,
        message: 'Mobile and name are required',
      });
    }
    
    const result = await authService.signUp({ mobile, name, language, address });
    
    res.status(201).json({
      success: true,
      message: 'Account created. OTP sent successfully',
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOTP = async (req, res, next) => {
  try {
    const { userId, mobile, otp } = req.body;
    
    if (!userId || !mobile || !otp) {
      return res.status(400).json({
        success: false,
        message: 'User ID, mobile, and OTP are required',
      });
    }
    
    const result = await authService.verifyOTP(userId, mobile, otp);
    
    res.status(200).json({
      success: true,
      message: 'OTP verified successfully',
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Resend OTP
// @route   POST /api/auth/resend-otp
// @access  Public
const resendOTP = async (req, res, next) => {
  try {
    const { userId, mobile } = req.body;
    
    if (!userId || !mobile) {
      return res.status(400).json({
        success: false,
        message: 'User ID and mobile are required',
      });
    }
    
    await authService.resendOTP(userId, mobile);
    
    res.status(200).json({
      success: true,
      message: 'OTP sent successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
  signUp,
  verifyOTP,
  resendOTP,
};
