import React from 'react';
import { Link } from 'react-router-dom';
import location from '../assets/images/location.png';
import clock from '../assets/images/clock.png';
import payment from '../assets/images/payment.png';
import auto from '../assets/images/auto.png';

const Hero = () => {
  const services = [
    { icon: location, title: 'Real-Time Tracking' },
    { icon: clock, title: '24/7 Availability' },
    { icon: auto, title: 'Eco-Friendly Rides' },
    { icon: payment, title: 'Easy Payments' },
  ];

  return (
    <div className="flex flex-col gap-7 mt-8 sm:mt-12 px-4 sm:px-8 lg:px-16">
      {/* Tagline */}
      <div className="text-center">
        <p className="text-3xl sm:text-4xl lg:text-5xl font-extrabold">
          Your Journey, Our Ride
        </p>
        <p className="text-sm sm:text-base lg:text-lg font-medium mt-3">
          Find, book, and ride rickshaws in seconds—reliable, local, eco-friendly
        </p>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center mt-4">
        <Link to="/booking">
          <button className="px-4 py-2 font-bold rounded hover:bg-green-600 hover:text-white bg-yellow-400 w-full sm:w-[120px] text-black text-sm">
            Book a Ride
          </button>
        </Link>
        <button className="px-4 py-2 font-bold rounded border hover:bg-yellow-400 hover:text-black border-yellow-400 bg-transparent w-full sm:w-[120px] text-yellow-400 text-sm">
          How it Works
        </button>
      </div>

      {/* Services Title */}
      <div className="text-2xl sm:text-3xl lg:text-4xl font-bold mt-12 text-center">
        <p>OUR SERVICES</p>
      </div>

      {/* Services Cards */}
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {services.map((service, index) => (
          <div
            key={index}
            className="w-full max-w-[180px] h-[200px] mx-auto [perspective:1000px]"
          >
            <div className="relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] hover:[transform:rotateY(180deg)]">
              {/* Front Side */}
              <div className="absolute w-full h-full rounded-3xl bg-green-500 flex flex-col items-center justify-center gap-3 px-4 py-5 backface-hidden">
                <img src={service.icon} alt={service.title} className="w-8 h-8" />
                <p className="text-white text-sm font-semibold text-center">
                  {service.title}
                </p>
              </div>
              {/* Back Side */}
              <div className="absolute w-full h-full rounded-3xl bg-yellow-400 flex items-center justify-center px-4 py-5 rotate-y-180 backface-hidden">
                <p className="text-center font-semibold text-black text-sm">
                  More Info Coming Soon
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Connecting Section */}
      <div className="py-10 mt-12 text-center">
        <p className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">
          Connecting You To <br /> Affordable Rides, <br /> Instantly
        </p>
        <hr className="border-4 border-yellow-500 w-24 sm:w-32 mx-auto mb-6 mt-4" />
        <p className="text-lg sm:text-xl lg:text-2xl">
          With Yatra, finding a ride is just a tap away. <br />
          Experience quick, affordable, and eco-friendly auto rickshaw rides.
        </p>
      </div>
    </div>
  );
};

export default Hero;