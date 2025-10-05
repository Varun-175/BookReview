import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
    Pragma: 'no-cache',
  },
  withCredentials: true,
  timeout: 15000, // 15s timeout for requests
});

// Attach token automatically to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;

    // Add cache-buster for GET requests
    if (config.method === 'get') {
      config.params = { ...(config.params || {}), t: Date.now() };
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Global response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      console.error('Network or CORS error:', error);
    } else {
      console.error('API error:', error.response.status, error.response.data);
    }
    return Promise.reject(error);
  }
);

/** ----------------- Auth ----------------- */
export const loginUser = (credentials) => api.post('/auth/login', credentials);
export const registerUser = (data) => api.post('/auth/register', data);
export const fetchProfile = () => api.get('/auth/profile');
export const updateProfile = (data) => api.put('/auth/profile', data);

/** ----------------- Books ----------------- */
export const fetchBooks = (params = {}) => api.get('/books', { params });
export const fetchBookDetails = (id) => api.get(`/books/${id}`);
export const createBook = (data) => api.post('/books', data);
export const updateBook = (id, data) => api.put(`/books/${id}`, data);
export const deleteBook = (id) => api.delete(`/books/${id}`);

/** ----------------- Reviews ----------------- */
export const fetchReviews = (bookId, params = {}) => api.get(`/reviews/book/${bookId}`, { params });
export const createReview = (bookId, data) => api.post(`/reviews/book/${bookId}`, data);
export const updateReview = (id, data) => api.put(`/reviews/${id}`, data);
export const deleteReview = (id) => api.delete(`/reviews/${id}`);

/** ----------------- User-specific ----------------- */
export const fetchMyBooks = () => api.get('/books/my-books');
export const fetchMyReviews = () => api.get('/reviews/my-reviews');

export default api;
