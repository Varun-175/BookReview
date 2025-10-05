import React from 'react';

const ReviewList = ({ reviews }) => {
  if (!reviews || reviews.length === 0) {
    return <p>No reviews yet.</p>;
  }

  return (
    <div className="space-y-4">
      {reviews.map(review => (
        <div key={review._id} className="border rounded-lg p-4">
          <div className="flex items-center mb-2">
            <span className="font-semibold">{review.user.name}</span>
            <span className="text-yellow-500 ml-2">{'★'.repeat(review.rating)}</span>
            <span className="text-gray-600 ml-2 text-sm">{new Date(review.createdAt).toLocaleDateString()}</span>
          </div>
          <p className="text-gray-800">{review.comment}</p>
        </div>
      ))}
    </div>
  );
};

export default ReviewList;