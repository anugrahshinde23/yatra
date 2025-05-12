import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { ClipLoader } from 'react-spinners';
import Navbar from './Navbar';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/login', formData, {
        withCredentials: true,
      });
      setMessage('Login successful! Redirecting...');
      toast.success('Login successful!');
      setTimeout(() => {
        setLoading(false);
        navigate('/booking');
      }, 2000);
    } catch (error) {
      setLoading(false);
      console.error('Login error:', error.response?.data);
      const errorMsg = error.response?.data?.error || 'Failed to login';
      setMessage(errorMsg);
      toast.error(errorMsg);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar />
      <section className="flex-grow py-12 bg-gradient-to-b from-gray-100 to-gray-200">
        <div className="container mx-auto px-4 sm:px-8 lg:px-16 fade-in">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-center mb-8 text-green-600 drop-shadow-md">
            Login
          </h2>
          <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-lg">
            <form onSubmit={handleSubmit}>
              <div className="mb-4 relative">
                <label className="block text-gray-700 font-semibold mb-1" htmlFor="email">
                  Email
                </label>
                <div className="flex items-center border rounded-lg p-2">
                  <FaEnvelope className="text-green-600 mr-2" aria-hidden="true" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-1 border-0 focus:outline-none focus:ring-0"
                    required
                    disabled={loading}
                    aria-label="Email address"
                  />
                </div>
              </div>
              <div className="mb-4 relative">
                <label className="block text-gray-700 font-semibold mb-1" htmlFor="password">
                  Password
                </label>
                <div className="flex items-center border rounded-lg p-2">
                  <FaLock className="text-green-600 mr-2" aria-hidden="true" />
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full p-1 border-0 focus:outline-none focus:ring-0"
                    required
                    disabled={loading}
                    aria-label="Password"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-green-600 text-white p-3 rounded-full font-semibold hover:scale-105 shadow-md transition-transform flex items-center justify-center"
                disabled={loading}
                aria-label="Login"
              >
                {loading ? (
                  <ClipLoader size={20} color="#fff" className="mr-2" />
                ) : (
                  'Login'
                )}
              </button>
            </form>
            {message && (
              <p
                className={`mt-4 text-center font-semibold ${
                  message.includes('successful') ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {message}
              </p>
            )}
            <p className="mt-4 text-center text-sm">
              Don't have an account?{' '}
              <a href="/signup" className="text-green-600 hover:underline">
                Sign Up
              </a>
            </p>
          </div>
        </div>
      </section>
      <footer className="bg-green-600 text-white py-6">
        <div className="container mx-auto px-4 sm:px-8 lg:px-16 text-center">
          <p className="mb-2">Contact us: support@yatra.com | +91 123-456-7890</p>
          <p>© 2025 Yatra Auto Rickshaw. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LoginPage;