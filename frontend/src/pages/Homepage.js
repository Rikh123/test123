import React from 'react';
import { useNavigate } from 'react-router-dom';

// Replace with your actual images if available
const legendImageUrl = 'https://via.placeholder.com/500x250?text=Mobile+Legend+Banner';
const mlbbLogoUrl = 'https://th.bing.com/th/id/OIP.g5qdQ2N-rLCO1ZzwBDca4gHaEQ?rs=1&pid=ImgDetMain';

const Homepage = () => {
  const navigate = useNavigate();

  const handleLogoClick = () => navigate('/login');
  const handleContactClick = () => window.open('https://wa.me/9362807677', '_blank');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#1f005c] via-[#5b0060] to-[#870160] px-6 py-12">
      <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 max-w-3xl w-full text-white space-y-8">

        {/* Banner Image */}
        <div className="overflow-hidden rounded-2xl shadow-lg">
          <img
            src={legendImageUrl}
            alt="Mobile Legends"
            className="w-full object-cover hover:scale-105 transition-transform duration-700"
          />
        </div>

        {/* Title */}
        <div className="text-center space-y-2">
          <h1 className="text-5xl font-bold tracking-wide drop-shadow-md">Rico Recharge Store</h1>
          <p className="text-xl text-gray-200">Fast. Secure. Trusted Mobile Legends Diamond Top-Up.</p>
        </div>

        {/* Logo & Call to Action */}
        <div className="flex flex-col items-center space-y-6">
          <div
            onClick={handleLogoClick}
            className="cursor-pointer bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-4 rounded-full shadow-xl hover:scale-110 transition-transform duration-500"
          >
            <img src={mlbbLogoUrl} alt="MLBB Logo" className="w-24 h-24 object-contain rounded-full" />
          </div>
          <p className="text-lg text-center max-w-sm">
            Tap the logo to start your recharge journey. Diamonds delivered with care and speed!
          </p>
        </div>

        {/* Contact Button */}
        <div className="text-center">
          <button
            onClick={handleContactClick}
            className="bg-green-500 hover:bg-green-600 active:bg-green-700 text-white text-lg font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-2xl transition duration-300"
          >
            💬 Contact Customer Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
