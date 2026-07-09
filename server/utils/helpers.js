/**
 * Parse User-Agent string to extract device and browser info
 * Lightweight parser without external dependencies
 * @param {string} userAgent - The User-Agent header string
 * @returns {{ device: string, browser: string }}
 */
export const parseUserAgent = (userAgent = '') => {
  const ua = userAgent.toLowerCase();

  // Detect device
  let device = 'Desktop';
  if (/mobile|android|iphone|ipod/.test(ua)) {
    device = 'Mobile';
  } else if (/tablet|ipad/.test(ua)) {
    device = 'Tablet';
  }

  // Detect browser
  let browser = 'Unknown';
  if (/edg/.test(ua)) browser = 'Edge';
  else if (/opr|opera/.test(ua)) browser = 'Opera';
  else if (/chrome|crios/.test(ua)) browser = 'Chrome';
  else if (/firefox|fxios/.test(ua)) browser = 'Firefox';
  else if (/safari/.test(ua)) browser = 'Safari';
  else if (/msie|trident/.test(ua)) browser = 'IE';

  return { device, browser };
};

/**
 * Get client IP address from request
 * Handles proxies and load balancers
 * @param {import('express').Request} req
 * @returns {string}
 */
export const getClientIp = (req) => {
  return (
    req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.socket?.remoteAddress ||
    'unknown'
  );
};
