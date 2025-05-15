import React from 'react';
import { useNavigate } from 'react-router-dom';

const diamondData = {
  "Special Pass Rates": [
    { diamonds: "Weekly Pass", price: 120 },
    { diamonds: "Twilight Pass", price: 670 },
  ],
  "Medium Packs": [
    { diamonds: 55, price: 65 },
    { diamonds: 86, price: 100 },
    { diamonds: 110, price: 130 },
    { diamonds: 141, price: 165 },
    { diamonds: 165, price: 190 },
    { diamonds: 172, price: 199 },
    { diamonds: 257, price: 295 },
    { diamonds: 275, price: 305 },
    { diamonds: 343, price: 390 },
    { diamonds: 429, price: 490 },
    { diamonds: 514, price: 570 },
    { diamonds: 565, price: 630 },
    { diamonds: 600, price: 680 },
    { diamonds: 706, price: 790 },
    { diamonds: 792, price: 890 },
    { diamonds: 878, price: 990 },
    { diamonds: 963, price: 1070 },
  ],
  "Large Packs": [
    { diamonds: 1049, price: 1160 },
    { diamonds: 1130, price: 1250 },
    { diamonds: 1220, price: 1350 },
    { diamonds: 1412, price: 1540 },
    { diamonds: 2195, price: 2330 },
    { diamonds: 3688, price: 3870 },
    { diamonds: 5532, price: 5850 },
    { diamonds: 9288, price: 9650 },
  ],
  "Double Diamonds": [
    { diamonds: "1000 (500+500)", price: 615 },
    { diamonds: "500 (250+250)", price: 305 },
    { diamonds: "300 (150+150)", price: 195 },
    { diamonds: "100 (50+50)", price: 65 },
  ],
};

const DiamondChart = () => {
  const navigate = useNavigate();

  const handlePackClick = () => {
    // Redirect to login page on pack click
    navigate('/login');
  };

  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-extrabold text-center mb-4">
        📍RICO RESELLER CHART 📍
      </h1>
      <p className="text-xl font-semibold text-center mb-8">
        💎 Exclusive Rates for Resellers – Buy & Earn!
      </p>
      {Object.entries(diamondData).map(([category, packs]) => (
        <div key={category}>
          <h2 className="text-2xl font-bold mb-4">{category}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {packs.map((pack, index) => (
              <div
                key={index}
                onClick={handlePackClick}
                className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 rounded-lg p-6 text-center shadow-lg hover:shadow-2xl hover:scale-105 transform transition cursor-pointer"
              >
                <h3 className="text-xl font-semibold mb-2 text-white">
                  {typeof pack.diamonds === 'number' ? `${pack.diamonds} 💎` : `💎 ${pack.diamonds}`}
                </h3>
                <p className="text-lg font-medium text-white">₹{pack.price}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
      <p className="mt-6 italic text-center text-gray-700">
        For other regions, rates are available too at slightly higher prices.
      </p>
    </div>
  );
};

export default DiamondChart;
