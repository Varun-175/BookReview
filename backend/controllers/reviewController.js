import Review from '../models/Review.js';
import Book from '../models/Book.js';
import mongoose from 'mongoose';

const recalcStats = async (bookId) => {
  const stats = await Review.aggregate([
    { $match: { book: new mongoose.Types.ObjectId(bookId) } },
    { $group: { _id: '$book', avg: { $avg: '$rating' }, cnt: { $sum: 1 } } }
  ]);
  const { avg = 0, cnt = 0 } = stats[0] || {};
  await Book.findByIdAndUpdate(bookId, {
    averageRating: Math.round(avg * 10) / 10,
    totalReviews: cnt
  });
};

export const getReviewsByBook = async (req, res) => {
  try {
    const { bookId } = req.params;
    const page  = Math.max(1, parseInt(req.query.page ) || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || 10);
    const skip  = (page - 1) * limit;

    if (!await Book.exists({ _id: bookId })) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const [reviews, total] = await Promise.all([
      Review.find({ book: bookId })
        .populate('user', 'name avatar')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Review.countDocuments({ book: bookId })
    ]);

    res.json({
      success: true,
      data: { reviews },
      pagination: {
        page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createReview = async (req, res) => {
  try {
    const { bookId } = req.params;
    const { rating, comment } = req.body;

    if (!await Book.exists({ _id: bookId })) {
      return res.status(404).json({ message: 'Book not found' });
    }
    if (await Review.exists({ book: bookId, user: req.user._id })) {
      return res.status(400).json({ message: 'Already reviewed' });
    }

    const review = await Review.create({
      book: bookId,
      user: req.user._id,
      rating,
      comment: comment || ''
    });
    await review.populate('user', 'name avatar');
    await recalcStats(bookId);

    res.status(201).json({ success: true, data: { review } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    if (!review.user.equals(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    Object.assign(review, {
      rating: req.body.rating ?? review.rating,
      comment: req.body.comment ?? review.comment
    });
    await review.save();
    await review.populate('user', 'name avatar');
    await recalcStats(review.book);

    res.json({ success: true, data: { review } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    if (!review.user.equals(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const bookId = review.book;
    await review.deleteOne();
    await recalcStats(bookId);

    res.json({ success: true, message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyReviews = async (req, res) => {
  try {
    const page  = Math.max(1, parseInt(req.query.page ) || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || 10);
    const skip  = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      Review.find({ user: req.user._id })
        .populate('book', 'title author coverImage')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Review.countDocuments({ user: req.user._id })
    ]);

    res.json({
      success: true,
      data: { reviews },
      pagination: {
        page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
