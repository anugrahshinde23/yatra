import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Suspense, lazy } from 'react';
import Navbar from './components/Navbar';

// Lazy load components
const Hero = lazy(() => import('./components/Hero'));
const BookingPage = lazy(() => import('./components/BookingPage'));
const SignupPage = lazy(() => import('./components/SignupPage'));
const LoginPage = lazy(() => import('./components/LoginPage'));
const AboutPage = lazy(() => import('./components/AboutPage'));
const ContactPage = lazy(() => import('./components/ContactPage'));
const BookingHistoryPage = lazy(() => import('./components/BookingHistoryPage'));
const NotFound = lazy(() => import('./components/NotFound'));

function App() {
  return (
    <Router>
      <div className="App">
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
        <Suspense fallback={<div className="text-center py-12">Loading...</div>}>
          <Routes>
            <Route path="/" element={<><Navbar /><Hero /></>} />
            <Route path="/booking" element={<BookingPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/history" element={<BookingHistoryPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
}

export default App;