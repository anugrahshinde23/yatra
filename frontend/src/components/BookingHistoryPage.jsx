import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const BookingHistoryPage = () => {
  const [bookings, setBookings] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/check-auth', { withCredentials: true })
      .then((response) => {
        if (response.data.isAuthenticated) {
          setIsAuthenticated(true);
          fetchBookings();
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

  const fetchBookings = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/bookings', {
        withCredentials: true,
      });
      setBookings(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching bookings:', error.response?.data);
      setLoading(false);
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
            Booking History
          </h2>
          <div className="max-w-3xl mx-auto">
            {loading ? (
              <div className="text-center">
                <p className="text-gray-700">Loading bookings...</p>
              </div>
            ) : bookings.length === 0 ? (
              <p className="text-center text-gray-700">No bookings found.</p>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="bg-white p-4 rounded-xl shadow-lg"
                  >
                    <p className="text-gray-700">
                      <span className="font-semibold">Name:</span> {booking.customer_name}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-semibold">Pickup:</span> {booking.pickup_location}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-semibold">Dropoff:</span> {booking.dropoff_location}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-semibold">Phone:</span> {booking.phone}
                    </p>
                  </div>
                ))}
              </div>
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

export default BookingHistoryPage;