import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserDashboard = () => {
  const [recharges, setRecharges] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserRecharges = async () => {
      try {
        const token = localStorage.getItem('token');
        const apiBaseUrl = window.location.protocol + '//' + window.location.hostname + ':5000';
        const res = await axios.get(`${apiBaseUrl}/recharge/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRecharges(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch your recharge requests');
      }
    };
    fetchUserRecharges();
  }, []);

  return (
    <div className="min-h-screen p-4 sm:p-6 bg-gradient-to-r from-green-700 via-green-600 to-green-500 text-white">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Your Recharge Status</h1>
      {error && <p className="mb-4 text-red-300">{error}</p>}
      <div className="overflow-x-auto bg-white rounded-lg shadow-lg text-gray-900">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-green-700 text-white">
            <tr>
              <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold">MLBB ID</th>
              <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold">Server ID</th>
              <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold">Pack</th>
              <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold">Status</th>
              <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold">IGN Username</th>
              <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {recharges.map((r) => (
              <tr key={r._id} className="hover:bg-green-100 hover:text-gray-900">
                <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm">{r.mlbbId}</td>
                <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm">{r.serverId}</td>
                <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm">{r.pack}</td>
                <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm">{r.status}</td>
                <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm">{r.ignName || 'N/A'}</td>
                <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm">₹{r.amount || '0'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserDashboard;
