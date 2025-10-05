import React from 'react';
import { Link } from 'react-router-dom';

// Path to your fallback cover image (ensure this file is present in your public folder)
const DEFAULT_COVER = '/default-cover.png';

const BookCard = ({ book }) => {
  // Choose the cover image property, fallback if none present
  const coverSrc =
    book.coverImage ||
    book.imageUrl ||
    book.cover ||
    DEFAULT_COVER;

  const handleImageError = (e) => {
    e.target.onerror = null; // Prevent infinite loop in case default image is also missing
    e.target.src = DEFAULT_COVER;
  };

  const roundedRating = Math.round(book.averageRating || 0);

  return (
    <div className="border rounded-lg p-4 shadow hover:shadow-md transition bg-white">
      <Link to={`/books/${book._id}`} className="block focus:outline-none focus:ring-2 focus:ring-blue-500 rounded">
        <img
          src={coverSrc}
          alt={book.title ? `${book.title} cover` : 'Book cover'}
          onError={handleImageError}
          className="w-full h-48 object-cover mb-2 rounded"
          loading="lazy"
        />
        <h3 className="text-lg font-semibold truncate">{book.title || 'Untitled Book'}</h3>
        <p className="text-sm text-gray-600 truncate">{book.author || 'Unknown Author'}</p>
        <div className="flex items-center mt-1" aria-label={`Rating: ${roundedRating} stars`}>
          <span className="text-yellow-500 mr-1">{'★'.repeat(roundedRating)}</span>
          <span className="text-gray-700 ml-1">({book.totalReviews || book.reviewCount || 0})</span>
        </div>
      </Link>
    </div>
  );
};

export default BookCard;
