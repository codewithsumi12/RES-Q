// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import MapPage from './pages/MapPage';
import Profile from './pages/Profile';
import AdminPanel from './pages/AdminPanel';
import Subscription from './pages/Subscription';
import SOSHistory from './pages/SOSHistory';
import Layout from './components/Layout';

// Protected route wrapper
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { currentUser, userProfile } = useAuth();
  if (!currentUser) return <Navigate to="/login" replace />;
  if (adminOnly && userProfile?.role !== 'admin') return <Navigate to="/" replace />;
  return children;
};

const AppRoutes = () => {
  const { currentUser } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={currentUser ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/signup" element={currentUser ? <Navigate to="/" replace /> : <Signup />} />

      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="map" element={<MapPage />} />
        <Route path="profile" element={<Profile />} />
        <Route path="subscription" element={<Subscription />} />
        <Route path="history" element={<SOSHistory />} />
        <Route path="admin" element={<ProtectedRoute adminOnly><AdminPanel /></ProtectedRoute>} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App = () => (
  <AuthProvider>
    <Router>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#1a1a1e',
            color: '#f0f0f0',
            border: '1px solid rgba(255,255,255,0.1)',
            fontFamily: "'Space Grotesk', sans-serif",
          },
          error: { iconTheme: { primary: '#ef4444', secondary: '#1a1a1e' } },
          success: { iconTheme: { primary: '#10b981', secondary: '#1a1a1e' } },
        }}
      />
      <AppRoutes />
    </Router>
  </AuthProvider>
);

export default App;
