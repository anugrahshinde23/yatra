import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../assets/images/logo.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/check-auth', { withCredentials: true })
      .then((response) => {
        setIsAuthenticated(response.data.isAuthenticated);
      })
      .catch((error) => {
        console.error('Check auth error:', error.message);
        setIsAuthenticated(false);
      });
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/api/logout', {}, { withCredentials: true });
      setIsAuthenticated(false);
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error.response?.data || error.message);
    }
  };

  return (
    <nav className="bg-green-600 sticky top-0 z-50 shadow-lg px-4 sm:px-10 py-3 flex justify-between items-center">
      <Link to="/">
        <img src={logo} alt="Yatra Logo" className="h-8 sm:h-10" />
      </Link>
      <div className="sm:hidden">
        <button onClick={toggleMenu} className="text-yellow-300 focus:outline-none" aria-label={isOpen ? "Close menu" : "Open menu"}>
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
            />
          </svg>
        </button>
      </div>
      <div
        className={`${
          isOpen ? 'flex' : 'hidden'
        } sm:flex flex-col sm:flex-row sm:items-center absolute sm:static top-16 left-0 w-full sm:w-auto bg-green-600 sm:bg-transparent px-4 sm:px-0 py-4 sm:py-0 transition-all duration-300 ease-in-out`}
      >
        <ul className="flex flex-col sm:flex-row sm:w-[400px] sm:justify-between text-sm font-semibold space-y-4 sm:space-y-0">
          <li className="hover:bg-yellow-400 hover:text-green-900 px-2 py-1 rounded transition-colors text-white sm:text-yellow-300">
            <Link to="/">Home</Link>
          </li>
          <li className="hover:bg-yellow-400 hover:text-green-900 px-2 py-1 rounded transition-colors text-white sm:text-yellow-300">
            <Link to="/about">About us</Link>
          </li>
          <li className="hover:bg-yellow-400 hover:text-green-900 px-2 py-1 rounded transition-colors text-white sm:text-yellow-300">
            <Link to="/contact">Contact us</Link>
          </li>
          {isAuthenticated && (
            <li className="hover:bg-yellow-400 hover:text-green-900 px-2 py-1 rounded transition-colors text-white sm:text-yellow-300">
              <Link to="/history">Booking History</Link>
            </li>
          )}
        </ul>
      </div>
      <div className="hidden sm:flex items-center space-x-4">
        {isAuthenticated ? (
          <button
            onClick={handleLogout}
            className="bg-yellow-400 text-green-900 px-4 py-2 rounded-full text-sm font-semibold hover:scale-105 shadow-md transition-transform"
            aria-label="Logout"
          >
            Logout
          </button>
        ) : (
          <>
            <Link
              to="/signup"
              className="bg-yellow-400 text-green-900 px-4 py-2 rounded-full text-sm font-semibold hover:scale-105 shadow-md transition-transform"
            >
              Signup
            </Link>
            <Link
              to="/login"
              className="border border-yellow-400 text-yellow-400 px-4 py-2 rounded-full text-sm font-semibold hover:bg-yellow-400 hover:text-green-900 shadow-md transition-all"
            >
              Login
            </Link>
          </>
        )}
      </div>
      {isOpen && (
        <div className="sm:hidden flex flex-col space-y-2 px-4 py-2">
          {isAuthenticated && (
            <Link
              to="/history"
              className="hover:bg-yellow-400 hover:text-green-900 px-2 py-1 rounded transition-colors text-white text-sm font-semibold text-center"
            >
              Booking History
            </Link>
          )}
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="bg-yellow-400 text-green-900 px-4 py-2 rounded-full text-sm font-semibold hover:scale-105 shadow-md transition-transform text-center"
              aria-label="Logout"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                to="/signup"
                className="bg-yellow-400 text-green-900 px-4 py-2 rounded-full text-sm font-semibold hover:scale-105 shadow-md transition-transform text-center"
              >
                Signup
              </Link>
              <Link
                to="/login"
                className="border border-yellow-400 text-yellow-400 px-4 py-2 rounded-full text-sm font-semibold hover:bg-yellow-400 hover:text-green-900 shadow-md transition-all text-center"
              >
                Login
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;