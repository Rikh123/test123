import React from 'react';
import { useLocation } from 'react-router-dom';

const Success = () => {
  const location = useLocation();
  const paymentStatus = location.state?.paymentStatus || 'Pending';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-800 p-6 px-4">
      <div className="bg-white bg-opacity-90 backdrop-blur-md p-10 rounded-3xl shadow-2xl max-w-md text-center border border-gray-200">
        <h2 className="text-4xl font-extrabold mb-6 text-gray-900 tracking-wide">
          {paymentStatus === 'Success' ? 'Recharge Successful' : 'Recharge Submitted'}
        </h2>
        <p className="text-lg text-gray-700">
          {paymentStatus === 'Success'
            ? 'Your payment was successful. Thank you for using our service!'
            : 'Your recharge will be processed in 5–10 minutes. Thank you for using our service!'}
        </p>
      </div>
    </div>
  );
};

export default Success;
