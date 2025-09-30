import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Home from './components/common/Home';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Game from './components/common/Game';
import Leaderboard from './components/common/Leaderboard';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes - allow guests */}
          <Route
            path="/game"
            element={
              <ProtectedRoute allowGuests={true}>
                <Game />
              </ProtectedRoute>
            }
          />
          <Route
            path="/leaderboard"
            element={
              <ProtectedRoute allowGuests={true}>
                <Leaderboard />
              </ProtectedRoute>
            }
          />

          {/* 404 redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
