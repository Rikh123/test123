import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import Homepage from './pages/Homepage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Recharge from './pages/Recharge';
import Success from './pages/Success';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';

function App() {
  const token = localStorage.getItem('token');
  const user = token ? jwt_decode(token) : null;
  const isAdmin = user?.isAdmin;

  const PrivateRoute = ({ children }) => {
    return token ? children : <Navigate to="/login" />;
  };

  const AdminRoute = ({ children }) => {
    return token && isAdmin ? children : <Navigate to="/login" />;
  };

  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/recharge"
        element={
          <PrivateRoute>
            <Recharge />
          </PrivateRoute>
        }
      />
      <Route
        path="/success"
        element={
          <PrivateRoute>
            <Success />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <UserDashboard />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default App;
