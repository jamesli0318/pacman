import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Game: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h1>Pacman Game</h1>
      <p>Welcome, {user?.username}!</p>
      <p>Best Score: {user?.best_score}</p>
      <p>Highest Level: {user?.highest_level}</p>
      <p>Total Games: {user?.total_games}</p>

      <div style={{ marginTop: '30px' }}>
        <p style={{ color: '#666', fontSize: '18px' }}>
          Game implementation coming in Phase 3!
        </p>
      </div>

      <div style={{ marginTop: '30px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
        <button
          onClick={() => navigate('/leaderboard')}
          style={{
            padding: '12px 24px',
            backgroundColor: '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600'
          }}
        >
          View Leaderboard
        </button>
        <button
          onClick={handleLogout}
          style={{
            padding: '12px 24px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600'
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Game;