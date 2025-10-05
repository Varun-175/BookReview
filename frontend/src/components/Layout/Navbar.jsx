import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate('/', { replace: true });
  };

  // Close on outside click
  useEffect(() => {
    const onClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const linkBase = 'text-gray-700 hover:text-blue-600 transition-colors';
  const activeClass = ({ isActive }) =>
    isActive ? 'text-blue-700 font-medium' : linkBase;

  const firstName = user?.name?.split(' ')[0] || 'User';

  return (
    <nav className="bg-white shadow mb-4">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-blue-600">BookReviews</Link>

        <div className="space-x-4 flex items-center">
          {isAuthenticated && (
            <NavLink to="/books" className={activeClass}>
              Books
            </NavLink>
          )}

          {!isAuthenticated ? (
            <>
              <NavLink to="/login" className={activeClass}>
                Login
              </NavLink>
              <NavLink to="/signup" className={activeClass}>
                Sign Up
              </NavLink>
            </>
          ) : (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setOpen((v) => !v)}
                className="flex items-center gap-2 text-gray-700 hover:text-blue-600"
                aria-haspopup="menu"
                aria-expanded={open}
              >
                <span>Hi, {firstName}</span>
                <svg
                  className={`w-4 h-4 transform transition-transform ${open ? 'rotate-180' : ''}`}
                  viewBox="0 0 20 20" fill="currentColor"
                >
                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.114l3.71-3.882a.75.75 0 111.08 1.04l-4.24 4.44a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                </svg>
              </button>

              {open && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-lg py-1 z-50"
                >
                  <Link
                    to="/profile"
                    role="menuitem"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    role="menuitem"
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
