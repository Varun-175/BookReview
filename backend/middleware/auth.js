import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Middleware to handle async errors for controllers/middleware
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Authentication middleware: verifies JWT token from header or cookie
export const auth = asyncHandler(async (req, res, next) => {
  // Extract raw authorization header or cookie
  const raw = req.headers.authorization || req.get?.('authorization') || '';
  const hasBearer = raw.toLowerCase().startsWith('bearer ');
  const headerToken = hasBearer ? raw.slice(7).trim() : null;
  const cookieToken = req.cookies?.token || null;

  // Use either header token or cookie token
  const token = headerToken || cookieToken;
  if (!token) {
    return res.status(401).json({ message: 'Authorization token missing' });
  }

  // Ensure JWT_SECRET is set in environment variables
  if (!process.env.JWT_SECRET) {
    // Fail fast in app startup is better, but handled here for now
    return res.status(500).json({ message: 'Server misconfiguration: JWT secret not set' });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    // Provide detailed error for expired token, invalid token, or others
    const message =
      err.name === 'TokenExpiredError'
        ? 'Token expired'
        : err.name === 'JsonWebTokenError'
        ? 'Invalid token'
        : 'Authentication error';
    return res.status(401).json({ message });
  }

  // Debug: Log decoded token payload to inspect fields
  console.log('Decoded JWT token:', decoded);

  // Use flexible check for user ID from token payload
  const userId = decoded.id || decoded._id || decoded.userId;
  if (!userId) {
    return res.status(401).json({ message: 'Token missing valid user ID' });
  }

  // Find user by resolved userId and exclude password field
  const user = await User.findById(userId).select('-password');
  if (!user) {
    return res.status(401).json({ message: 'User not found' });
  }

  // Attach user and token to request object for downstream middleware/controllers
  req.user = user;
  req.token = token;

  return next();
});

// Role-based access control middleware
export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: Insufficient privileges' });
    }
    next();
  };
};

// Note: On app startup, consider failing fast if JWT_SECRET is not set:
// if (!process.env.JWT_SECRET) {
//   throw new Error('JWT_SECRET environment variable is required');
// }
