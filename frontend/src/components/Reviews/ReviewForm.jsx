import React, { useState, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { createReview } from '../../services/api';

const ReviewForm = ({ bookId, onReview }) => {
  const { token } = useContext(AuthContext);
  const [rating, setRating] = useState(1);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setError('You must be logged in to submit a review.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await createReview(bookId, { rating, comment });
      setComment('');
      setRating(1);
      onReview();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      {error && <p className="text-red-600 mb-2">{error}</p>}
      <div className="flex items-center mb-2">
        <label className="mr-2">Rating:</label>
        <select value={rating} onChange={e => setRating(+e.target.value)} className="border rounded px-2 py-1">
          {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
        </select>
      </div>
      <div className="mb-2">
        <textarea
          value={comment}
          onChange={e => setComment(e.target.value)}
          rows="3"
          className="w-full border rounded p-2"
          placeholder="Write your review..."
          required
        />
      </div>
      <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded">
        {loading ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
};

export default ReviewForm;