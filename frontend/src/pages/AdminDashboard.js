import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [recharges, setRecharges] = useState([]);
  const [error, setError] = useState('');
  const [loadingIds, setLoadingIds] = useState(new Set());

  useEffect(() => {
      const fetchRecharges = async () => {
        try {
          const token = localStorage.getItem('token');
      const apiBaseUrl = window.location.hostname === 'localhost' ? window.location.protocol + '//' + window.location.hostname + ':5000' : '';
      const res = await axios.get(`${apiBaseUrl}/api/recharge/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
          console.log('Fetched recharges:', res.data);
          setRecharges(res.data);
        } catch (err) {
          setError(err.response?.data?.message || 'Failed to fetch recharge requests');
        }
      };
    fetchRecharges();
  }, []);

  const rechargeDoneCount = recharges.filter(r => r.status === 'Processed').length;

  const handleStatusChange = async (r, newStatus) => {
    setLoadingIds((prev) => new Set(prev).add(r._id));
    try {
      const token = localStorage.getItem('token');
      const apiBaseUrl = window.location.hostname === 'localhost' ? window.location.protocol + '//' + window.location.hostname + ':5000' : '';
      const response = await fetch(`${apiBaseUrl}/api/recharge/verify-payment/${r._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok) {
        throw new Error('Failed to update status');
      }
      setRecharges((prevRecharges) =>
        prevRecharges.map((item) =>
          item._id === r._id ? { ...item, status: newStatus } : item
        )
      );
      alert('Status updated successfully');
    } catch (error) {
      alert('Error updating status: ' + error.message);
    } finally {
      setLoadingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(r._id);
        return newSet;
      });
    }
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 bg-gradient-to-r from-purple-700 via-pink-600 to-red-500 text-white">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Admin Dashboard</h1>
      {error && <p className="mb-4 text-red-300">{error}</p>}
      <div className="mb-4 text-lg font-semibold">
        Recharge Done: {rechargeDoneCount}
      </div>
      <div className="overflow-x-auto bg-white rounded-lg shadow-lg text-gray-900">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-purple-700 text-white">
            <tr>
              <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold">MLBB ID</th>
              <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold">Server ID</th>
              <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold">Pack</th>
              <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold">Status</th>
              <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold">IGN Username</th>
              <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold">User Email</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {recharges.map((r) => (
              <tr key={r._id} className="hover:bg-purple-100 hover:text-gray-900">
                <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm">{r.mlbbId}</td>
                <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm">{r.serverId}</td>
                <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm">{r.pack}</td>
                <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
                  <select
                    className="bg-white border border-gray-300 rounded px-2 py-1 text-xs sm:text-sm"
                    value={r.status}
                    disabled={loadingIds.has(r._id)}
                    onChange={(e) => handleStatusChange(r, e.target.value)}
                  >
                    <option value="PendingPayment">Pending Payment</option>
                    <option value="PendingVerification">Pending Verification</option>
                    <option value="Processed">Recharge Done</option>
                    <option value="Failed">Faild</option>
                    
                  </select>
                </td>
                <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm">{r.ignName || 'N/A'}</td>
                <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm">{r.userId?.email || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
