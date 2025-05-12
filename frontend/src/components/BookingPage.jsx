import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaUser, FaMapMarkerAlt, FaPhone } from 'react-icons/fa';
import { ClipLoader } from 'react-spinners';
import Navbar from './Navbar';

const BookingPage = () => {
  const [formData, setFormData] = useState({
    customerName: '',
    pickupLocation: '',
    dropoffLocation: '',
    phone: '',
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/check-auth', { withCredentials: true })
      .then((response) => {
        if (response.data.isAuthenticated) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          navigate('/login');
        }
      })
      .catch((error) => {
        console.error('Check auth error:', error.message);
        setIsAuthenticated(false);
        navigate('/login');
      });
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        'http://localhost:5000/api/bookings',
        formData,
        { withCredentials: true }
      );
      setMessage('Booking created successfully!');
      toast.success('Booking created successfully!');
      setFormData({ customerName: '', pickupLocation: '', dropoffLocation: '', phone: '' });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Booking error:', error.response?.data);
      const errorMsg = error.response?.data?.error || 'Failed to create booking';
      setMessage(errorMsg);
      toast.error(errorMsg);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar />
      <section className="flex-grow py-12 bg-gradient-to-b from-gray-100 to-gray-200">
        <div className="container mx-auto px-4 sm:px-8 lg:px-16 fade-in">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-center mb-8 text-green-600 drop-shadow-md">
            Book Your Ride
          </h2>
          <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-lg">
            <form onSubmit={handleSubmit}>
              <div className="mb-4 relative">
                <label className="block text-gray-700 font-semibold mb-1" htmlFor="customerName">
                  Name
                </label>
                <div className="flex items-center border rounded-lg p-2">
                  <FaUser className="text-green-600 mr-2" aria-hidden="true" />
                  <input
                    type="text"
                    id="customerName"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleChange}
                    className="w-full p-1 border-0 focus:outline-none focus:ring-0"
                    required
                    disabled={loading}
                    aria-label="Customer name"
                  />
                </div>
              </div>
              <div className="mb-4 relative">
                <label className="block text-gray-700 font-semibold mb-1" htmlFor="pickupLocation">
                  Pickup Location
                </label>
                <div className="flex items-center border rounded-lg p-2">
                  <FaMapMarkerAlt className="text-green-600 mr-2" aria-hidden="true" />
                  <input
                    type="text"
                    id="pickupLocation"
                    name="pickupLocation"
                    value={formData.pickupLocation}
                    onChange={handleChange}
                    className="w-full p-1 border-0 focus:outline-none focus:ring-0"
                    required
                    disabled={loading}
                    aria-label="Pickup location"
                  />
                </div>
              </div>
              <div className="mb-4 relative">
                <label className="block text-gray-700 font-semibold mb-1" htmlFor="dropoffLocation">
                  Dropoff Location
                </label>
                <div className="flex items-center border rounded-lg p-2">
                  <FaMapMarkerAlt className="text-green-600 mr-2" aria-hidden="true" />
                  <input
                    type="text"
                    id="dropoffLocation"
                    name="dropoffLocation"
                    value={formData.dropoffLocation}
                    onChange={handleChange}
                    className="w-full p-1 border-0 focus:outline-none focus:ring-0"
                    required
                    disabled={loading}
                    aria-label="Dropoff location"
                  />
                </div>
              </div>
              <div className="mb-4 relative">
                <label className="block text-gray-700 font-semibold mb-1" htmlFor="phone">
                  Phone
                </label>
                <div className="flex items-center border rounded-lg p-2">
                  <FaPhone className="text-green-600 mr-2" aria-hidden="true" />
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full p-1 border-0 focus:outline-none focus:ring-0"
                    required
                    disabled={loading}
                    aria-label="Phone number"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-green-600 text-white p-3 rounded-full font-semibold hover:scale-105 shadow-md transition-transform flex items-center justify-center"
                disabled={loading}
                aria-label="Book now"
              >
                {loading ? (
                  <ClipLoader size={20} color="#fff" className="mr-2" />
                ) : (
                  'Book Now'
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

export default BookingPage;