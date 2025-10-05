// backend/models/Book.js
import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  title:          { type: String, required: true, trim: true },
  author:         { type: String, required: true, trim: true },
  description:    { type: String, required: true },
  genre:          { type: String, index: true },
  publishedYear:  { type: Number },
  isbn:           { type: String },
  coverImage:     { type: String },
  averageRating:  { type: Number, default: 0 },
  totalReviews:   { type: Number, default: 0 },
  createdBy:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, {
  timestamps: true,
  toJSON:     { virtuals: true, versionKey: false },
  toObject:   { virtuals: true }
});

// Compound indexes for efficient querying
bookSchema.index({ genre: 1, averageRating: -1, createdAt: -1 }, { name: 'genre_rating_date' });
bookSchema.index({ title: 'text', author: 'text', description: 'text' }, { name: 'text_search' });
bookSchema.index({ createdBy: 1, createdAt: -1 });

export default mongoose.model('Book', bookSchema);
