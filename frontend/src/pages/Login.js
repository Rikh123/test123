import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import jwt_decode from 'jwt-decode';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post(`/api/auth/login`, { email, password });
      localStorage.setItem('token', res.data.token);
      const decoded = jwt_decode(res.data.token);
      if (decoded.isAdmin) {
        navigate('/admin');
      } else {
        navigate('/recharge');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-800 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white bg-opacity-90 backdrop-blur-md p-10 rounded-3xl shadow-2xl w-full max-w-md border border-gray-200"
      >
        <h2 className="text-3xl font-extrabold mb-8 text-center text-gray-900 tracking-wide">Welcome Back</h2>
        {error && <p className="text-red-600 mb-6 text-center font-medium">{error}</p>}
        <div className="mb-6">
          <label className="block mb-2 font-semibold text-gray-700">Email Address</label>
          <input
            type="email"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-indigo-400 transition-shadow shadow-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="username"
            placeholder="you@example.com"
          />
        </div>
        <div className="mb-8">
          <label className="block mb-2 font-semibold text-gray-700">Password</label>
          <input
            type="password"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-indigo-400 transition-shadow shadow-sm"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            placeholder="Enter your password"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 transition duration-300 shadow-lg hover:shadow-xl font-semibold tracking-wide"
        >
          Log In
        </button>
        <p className="mt-6 text-center text-gray-700">
          Don't have an account?{' '}
          <Link to="/signup" className="text-indigo-600 font-semibold hover:underline">
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
