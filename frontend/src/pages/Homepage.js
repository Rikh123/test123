import React from 'react';
import { useNavigate } from 'react-router-dom';

// Placeholder images URLs or import your own images here
const legendImageUrl = 'https://via.placeholder.com/300x100?text=Mobile+Legend+Picture';
// Updated MLBB logo URL as per user request
const mlbbLogoUrl = 'https://th.bing.com/th/id/OIP.g5qdQ2N-rLCO1ZzwBDca4gHaEQ?rs=1&pid=ImgDetMain';

const Homepage = () => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/login');
  };

  const handleContactClick = () => {
    window.open('https://wa.me/9362807677', '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-800 text-white flex flex-col items-center p-6">
      {/* Mobile Legend Picture */}
      <div className="mb-6 w-full max-w-xs">
        <img
          src={legendImageUrl}
          alt="Mobile Legend"
          className="w-full rounded-3xl shadow-2xl transform hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Website Name */}
      <header className="mb-8 text-center">
        <h2 className="text-4xl font-extrabold mb-2 drop-shadow-2xl tracking-wide">Rico Website</h2>
        <h1 className="text-5xl font-extrabold mb-4 drop-shadow-2xl tracking-wide">Mobile Legends Recharge</h1>
      </header>

      {/* MLBB Recharge Logo */}
      <div
        className="mb-8 cursor-pointer w-24 sm:w-32 rounded-3xl shadow-2xl hover:shadow-4xl transform hover:scale-110 transition-transform duration-500 bg-gradient-to-r from-purple-700 via-pink-600 to-red-500 p-4"
        onClick={handleLogoClick}
      >
        <img src={mlbbLogoUrl} alt="MLBB Recharge Logo" className="w-full rounded-3xl" />
      </div>

      {/* Description */}
      <p className="text-lg max-w-md text-center mb-12 drop-shadow-lg">
        Recharge your Mobile Legends diamonds quickly and securely.
      </p>

      {/* Customer Contact */}
      <button
        onClick={handleContactClick}
        className="bg-green-500 hover:bg-green-600 active:bg-green-700 text-white font-semibold py-3 px-8 rounded-full shadow-lg hover:shadow-2xl transition duration-300"
      >
        Contact Customer Support
      </button>
    </div>
  );
};

export default Homepage;
