import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Book Review Platform
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Discover amazing books, share your thoughts, and connect with fellow readers
        </p>
        <div className="space-x-4">
          <Link 
            to="/books" 
            className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg hover:bg-blue-700 transition"
          >
            Browse Books
          </Link>
          <Link 
            to="/signup" 
            className="bg-gray-200 text-gray-800 px-8 py-3 rounded-lg text-lg hover:bg-gray-300 transition"
          >
            Join Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;