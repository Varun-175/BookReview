import Book from '../models/Book.js';
import Review from '../models/Review.js';

export const listBooks = async (req, res) => {
  try {
    const page  = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || 12);
    const skip  = (page - 1) * limit;

    const query = {};
    if (req.query.search) {
      query.title = { $regex: req.query.search, $options: 'i' };
    }
    if (req.query.genre) {
      query.genre = req.query.genre;
    }

    let sort = { createdAt: -1 };
    if (req.query.sort === 'oldest') sort = { createdAt: 1 };
    else if (req.query.sort === 'rating') sort = { averageRating: -1, createdAt: -1 };
    else if (req.query.sort === 'title') sort = { title: 1 };

    const [books, total] = await Promise.all([
      Book.find(query)
        .populate('createdBy', 'name avatar')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Book.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: { books },
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

export const getBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
      .populate('createdBy', 'name avatar')
      .lean();

    if (!book) return res.status(404).json({ message: 'Book not found' });

    const reviews = await Review.find({ book: book._id })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      data: { book: { ...book, reviews } }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createBook = async (req, res) => {
  try {
    const book = await Book.create({ ...req.body, createdBy: req.user._id });
    await book.populate('createdBy', 'name avatar');
    res.status(201).json({ success: true, data: { book } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    if (!book.createdBy.equals(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    Object.assign(book, req.body);
    await book.save();
    await book.populate('createdBy', 'name avatar');
    res.json({ success: true, data: { book } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    if (!book.createdBy.equals(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Review.deleteMany({ book: book._id });
    await book.deleteOne();
    res.json({ success: true, message: 'Book deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const myBooks = async (req, res) => {
  try {
    const books = await Book.find({ createdBy: req.user._id })
      .populate('createdBy', 'name avatar')
      .sort({ createdAt: -1 })
      .lean();
    res.json({ success: true, data: { books } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
