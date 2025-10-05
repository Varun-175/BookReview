import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { fetchBookDetails } from '../../services/api';
import ReviewList from '../Reviews/ReviewList';
import ReviewForm from '../Reviews/ReviewForm';

const BookDetails = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadBook = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchBookDetails(id);
      console.log('Book details API payload:', response.data);
      setBook(response.data.data.book);
    } catch (err) {
      console.error('Error fetching book details:', err);
      setError('Failed to load book details');
    } finally {
      setLoading(false);
    }
  }, [id]);
  

  useEffect(() => {
    loadBook();
  }, [loadBook]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!book) return <p>Book not found.</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{book.title}</h1>
      <p className="text-gray-700 mb-2">by {book.author}</p>
      <img
        src={book.coverImage || '/default-cover.png'}
        alt={book.title}
        className="w-64 h-auto mb-4"
      />
      <p className="mb-4">{book.description}</p>
      <ReviewForm bookId={id} onReview={loadBook} />
      <ReviewList reviews={book.reviews || []} />
    </div>
  );
};

export default BookDetails;
