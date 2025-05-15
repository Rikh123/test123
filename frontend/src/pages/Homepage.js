import React from 'react';
import { useNavigate } from 'react-router-dom';

const legendImageUrl = 'https://via.placeholder.com/500x250?text=Mobile+Legend+Banner';
const mlbbLogoUrl = 'https://th.bing.com/th/id/OIP.g5qdQ2N-rLCO1ZzwBDca4gHaEQ?rs=1&pid=ImgDetMain';

const rechargePacks = [
  { amount: '86 Diamonds', price: '₹160' },
  { amount: '172 Diamonds', price: '₹320' },
  { amount: '257 Diamonds', price: '₹480' },
  { amount: '344 Diamonds', price: '₹640' },
  { amount: '514 Diamonds', price: '₹960' },
];

const Homepage = () => {
  const navigate = useNavigate();
  const handleLogoClick = () => navigate('/login');
  const handleContactClick = () => window.open('https://wa.me/9362807677', '_blank');

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0c50] via-[#6b0f8e] to-[#d0006f] text-white px-4 py-10 flex flex-col items-center">

      {/* Hero Banner */}
      <div className="w-full max-w-4xl mb-10 rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-700">
        <img
          src={legendImageUrl}
          alt="Mobile Legends Banner"
          className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700"
        />
      </div>

      {/* Title Section */}
      <div className="text-center mb-10 space-y-3">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-wide drop-shadow-md">🔥 Rico Recharge Store</h1>
        <p className="text-lg sm:text-xl text-gray-200">Instant & Safe Mobile Legends Diamonds Top-Up</p>
      </div>

      {/* MLBB Logo CTA */}
      <div
        onClick={handleLogoClick}
        className="cursor-pointer bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-600 p-4 rounded-full shadow-lg hover:scale-110 transition-transform duration-500 mb-10"
      >
        <img src={mlbbLogoUrl} alt="MLBB Logo" className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-contain" />
        <p className="text-sm text-center mt-2">Tap Logo to Recharge</p>
      </div>

      {/* Recharge Packs Section */}
      <section className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-4 mb-14">
        {rechargePacks.map((pack, index) => (
          <div
            key={index}
            className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl shadow-xl p-6 text-center transition-all hover:scale-105 hover:shadow-2xl"
          >
            <h3 className="text-2xl font-bold mb-2">{pack.amount}</h3>
            <p className="text-xl font-semibold text-green-300">{pack.price}</p>
            <button
              className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-full transition"
              onClick={handleLogoClick}
            >
              Recharge Now
            </button>
          </div>
        ))}
      </section>

      {/* Support Button */}
      <button
        onClick={handleContactClick}
        className="bg-green-500 hover:bg-green-600 active:bg-green-700 text-white font-semibold text-lg px-8 py-3 rounded-full shadow-lg hover:shadow-2xl transition"
      >
        💬 Contact Customer Support
      </button>

      {/* Floating WhatsApp */}
      <a
        href="https://wa.me/9362807677"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 p-3 rounded-full shadow-2xl z-50 transition-all"
      >
        <img
          src="https://cdn-icons-png.flaticon.com/512/733/733585.png"
          alt="WhatsApp"
          className="w-7 h-7"
        />
      </a>
    </div>
  );
};

export default Homepage;
