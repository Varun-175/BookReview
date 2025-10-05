import express from 'express';
import Book from '../models/Book.js';
import Review from '../models/Review.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// GET /api/profile/counts - get book/review counts for logged-in user
router.get('/counts', auth, async (req, res) => {
  try {
    const userId = req.user._id;

    // Count books added by this user
    const booksAdded = await Book.countDocuments({ addedBy: userId });

    // Count reviews given by this user
    const reviewsGiven = await Review.countDocuments({ userId });

    res.json({ booksAdded, reviewsGiven });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
