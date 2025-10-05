import mongoose from 'mongoose'

const reviewSchema = new mongoose.Schema({
  book:    { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  user:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating:  { type: Number, min: 1, max: 5, required: true },
  comment: { type: String, trim: true, required: true }, // enforce non-empty comments
}, {
  timestamps: true,
  toJSON:     { virtuals: true, versionKey: false },
  toObject:   { virtuals: true }
})

reviewSchema.index({ book: 1, user: 1 }, { unique: true, name: 'book_user_unique' })
reviewSchema.index({ book: 1, createdAt: -1 })
reviewSchema.index({ user: 1, createdAt: -1 })
// Index for sorting by rating if you use this frequently:
reviewSchema.index({ book: 1, rating: -1 })

// Static for calculating average rating (optional)
reviewSchema.statics.getAverageRating = async function(bookId) {
  const result = await this.aggregate([
    { $match: { book: mongoose.Types.ObjectId(bookId) } },
    { $group: { _id: '$book', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } }
  ]);
  return result[0] || { avgRating: 0, count: 0 };
};

export default mongoose.model('Review', reviewSchema)
