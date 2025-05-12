import Navbar from './Navbar';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar />
      <section className="flex-grow py-12 bg-gradient-to-b from-gray-100 to-gray-200">
        <div className="container mx-auto px-4 sm:px-8 lg:px-16 fade-in">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-center mb-8 text-green-600 drop-shadow-md">
            About Yatra Auto Rickshaw
          </h2>
          <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-lg">
            <p className="text-gray-700 mb-4">
              Yatra Auto Rickshaw is dedicated to making local transportation easy, affordable, and eco-friendly. We connect passengers with reliable auto rickshaw drivers, ensuring a seamless ride experience in urban and suburban areas.
            </p>
            <h3 className="text-xl font-semibold text-green-600 mb-2">Our Mission</h3>
            <p className="text-gray-700 mb-4">
              To empower communities by providing sustainable and accessible transportation solutions, reducing carbon footprints, and supporting local drivers.
            </p>
            <h3 className="text-xl font-semibold text-green-600 mb-2">Our Vision</h3>
            <p className="text-gray-700">
              To become the leading platform for auto rickshaw services, fostering a greener future while enhancing the daily commute for millions.
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

export default AboutPage;