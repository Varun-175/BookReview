// routes/auth.js
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../models/User.js';

const router = express.Router();

/* ========== Helpers ========== */
const normalizeEmail = (email = '') => email.toLowerCase().trim();
const trimText = (txt = '') => txt.trim();

const signToken = (user) =>
  jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });

const toSafeUser = (doc) => {
  const { password: _pw, ...safe } = doc.toObject();
  return safe;
};

const extractBearerToken = (req) => {
  const raw = req.headers.authorization || '';
  const hasBearer = raw.toLowerCase().startsWith('bearer ');
  return hasBearer ? raw.slice(7).trim() : null;
};

const requireJwt = async (req, res, next) => {
  try {
    const token = extractBearerToken(req);
    if (!token) return res.status(401).json({ message: 'No token provided' });
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: 'Server misconfiguration: JWT secret not set' });
    }
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res
        .status(401)
        .json({ message: err?.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token' });
    }
    req.auth = decoded; // { userId, email, iat, exp }
    next();
  } catch (e) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

/* ========== Routes ========== */

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  try {
    const { name = '', email = '', password = '' } = req.body || {};

    const cleanName = trimText(name);
    const cleanEmail = normalizeEmail(email);

    if (!cleanName || !cleanEmail || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    console.log('Signup attempt:', { name: cleanName, email: cleanEmail });
    console.log('Database name:', mongoose.connection.name);

    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Rely on model pre-save hook to hash password
    const user = new User({
      name: cleanName,
      email: cleanEmail,
      password, // raw password; hook will hash
    });

    await user.save();

    console.log('User created successfully:', user._id);
    console.log('Saved to collection:', User.collection.name);

    const token = signToken(user);
    return res.status(201).json({
      message: 'User created successfully',
      token,
      user: toSafeUser(user),
    });
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email = '', password = '' } = req.body || {};

    const cleanEmail = normalizeEmail(email);
    if (!cleanEmail || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    console.log('Login attempt:', cleanEmail);

    const user = await User.findOne({ email: cleanEmail }).select('+password');
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = signToken(user);
    return res.json({
      message: 'Login successful',
      token,
      user: toSafeUser(user),
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/auth/verify
router.get('/verify', requireJwt, async (req, res) => {
  try {
    const user = await User.findById(req.auth.userId);
    if (!user) return res.status(401).json({ message: 'User not found' });
    return res.json(toSafeUser(user));
  } catch (error) {
    console.error('Verify error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/auth/profile
router.get('/profile', requireJwt, async (req, res) => {
  try {
    const user = await User.findById(req.auth.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.json(toSafeUser(user));
  } catch (error) {
    console.error('Profile error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/auth/profile
router.put('/profile', requireJwt, async (req, res) => {
  try {
    const { name = '', avatar } = req.body || {};
    const updates = {};

    if (typeof name === 'string' && name.trim()) updates.name = name.trim();
    // Allow clearing or setting avatar: send empty string to clear
    if (typeof avatar === 'string') updates.avatar = avatar;

    if (!Object.keys(updates).length) {
      return res.status(400).json({ message: 'No valid fields to update' });
    }

    const user = await User.findByIdAndUpdate(
      req.auth.userId,
      { $set: updates },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: 'User not found' });

    return res.json({ user: toSafeUser(user) });
  } catch (error) {
    console.error('Profile update error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

export default router;
