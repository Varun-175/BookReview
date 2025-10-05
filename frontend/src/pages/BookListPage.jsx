import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BookList from '../components/Books/BookList';
import { fetchBooks } from '../services/api';

const BookListPage = () => {
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    genre: '',
    sort: 'newest'
  });

  useEffect(() => {
    const loadBooks = async () => {
      setLoading(true);
      try {
        const response = await fetchBooks({ page, ...filters });
        setBooks(response.data.books);
        setTotalPages(response.data.pagination.pages);
      } catch (error) {
        console.error('Failed to load books:', error);
      } finally {
        setLoading(false);
      }
    };
    loadBooks();
  }, [page, filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">All Books</h1>
        <Link 
          to="/books/add" 
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Book
        </Link>
      </div>
      
      {/* Filter Controls */}
      <div className="mb-6 flex flex-wrap gap-4">
        <input
          type="text"
          placeholder="Search books..."
          value={filters.search}
          onChange={(e) => handleFilterChange({...filters, search: e.target.value})}
          className="border rounded px-3 py-2"
        />
        <select
          value={filters.genre}
          onChange={(e) => handleFilterChange({...filters, genre: e.target.value})}
          className="border rounded px-3 py-2"
        >
          <option value="">All Genres</option>
          <option value="Fiction">Fiction</option>
          <option value="Non-Fiction">Non-Fiction</option>
          <option value="Mystery">Mystery</option>
          <option value="Science Fiction">Science Fiction</option>
          <option value="Fantasy">Fantasy</option>
        </select>
        <select
          value={filters.sort}
          onChange={(e) => handleFilterChange({...filters, sort: e.target.value})}
          className="border rounded px-3 py-2"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="rating">Highest Rated</option>
          <option value="title">Title A-Z</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center">Loading books...</div>
      ) : (
        <>
          <BookList books={books} />
          
          {/* Pagination */}
          <div className="flex justify-center items-center mt-8 space-x-4">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-gray-700">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default BookListPage;