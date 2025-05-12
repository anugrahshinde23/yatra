import { Link } from 'react-router-dom';
import Navbar from './Navbar';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar />
      <section className="flex-grow py-12 bg-gradient-to-b from-gray-100 to-gray-200">
        <div className="container mx-auto px-4 sm:px-8 lg:px-16 fade-in">
          <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-lg text-center">
            <h2 className="text-4xl font-extrabold text-red-600 mb-4">404</h2>
            <p className="text-gray-700 mb-6">Oops! The page you're looking for doesn't exist.</p>
            <Link
              to="/"
              className="bg-green-600 text-white px-6 py-3 rounded-full font-semibold hover:scale-105 shadow-md transition-transform"
            >
              Go Back Home
            </Link>
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

export default NotFound;