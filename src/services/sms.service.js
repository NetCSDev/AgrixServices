// use global fetch if available (Node v18+); otherwise try to load node-fetch
let fetchFn;
if (typeof global.fetch === 'function') {
  fetchFn = global.fetch;
} else {
  try {
    fetchFn = require('node-fetch');
  } catch (e) {
    throw new Error('Fetch API is not available. Please run on Node 18+ or install node-fetch');
  }
}

const fetch = fetchFn;

// Fast2SMS configuration
const BASE_URL = 'https://www.fast2sms.com/dev/bulkV2';
const API_KEY = process.env.FAST2SMS_API_KEY || '';

class SMSService {
  constructor() {
    this.apiKey = API_KEY;
    this.baseUrl = BASE_URL;
    this.senderId = 'IGNYX';
    this.route = 'dlt'; // "otp" by default
  }

  isConfigured() {
    return !!this.apiKey && this.apiKey.length > 0;
  }

  formatMobile(mobile) {
    let formatted = String(mobile).replace(/[^0-9]/g, '');
    if (formatted.startsWith('91') && formatted.length === 12) {
      formatted = formatted.substring(2);
    }
    return formatted;
  }

  async sendOTP(mobile, otp) {
    if (!this.isConfigured()) {
      throw new Error('Fast2SMS API key not configured (FAST2SMS_API_KEY)');
    }

    const formatted = this.formatMobile(mobile);
    if (formatted.length !== 10) {
      throw new Error('Invalid mobile number. Must be 10 digits (without country code).');
    }

    const body = {
      route: this.route,
      sender_id: this.senderId,
      variables_values: otp,
      numbers: formatted,
      message: 208417, // template id (hardcoded for OTP), change as needed
    };

    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        authorization: this.apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    console.log(`Fast2SMS response status: ${response}`);

    const text = await response.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error('Fast2SMS returned non-JSON response:', text);
      throw new Error('SMS API error: invalid response format');
    }

    if (response.status === 401 || response.status === 412 || data.status_code === 412) {
      throw new Error('FAST2SMS_AUTH_FAILED');
    }

    if (!response.ok || !data.return) {
      const msg = data.message ? (Array.isArray(data.message) ? data.message.join(', ') : data.message) : text;

      // handle unverified OTP API scenario by logging a warning instead of throwing
      if (response.status === 400 && msg.includes('Before using OTP Message API')) {
        console.warn('Fast2SMS setup incomplete: website verification required for OTP API. OTP not sent.');
        return null; // caller can decide how to proceed
      }

      throw new Error(`SMS API error: ${response.status} - ${msg}`);
    }

    return data.request_id;
  }
}

module.exports = new SMSService();
