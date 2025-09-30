import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import GameBoard from '../game/GameBoard';

const Game: React.FC = () => {
  const { isGuest, logout } = useAuth();
  const navigate = useNavigate();
  const [currentLevel, setCurrentLevel] = useState(1);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleBackHome = () => {
    navigate('/');
  };

  const handleLevelComplete = () => {
    if (currentLevel < 10) {
      setCurrentLevel(prev => prev + 1);
    } else {
      // Victory!
      alert('Congratulations! You completed all levels!');
    }
  };

  const handleGameOver = () => {
    // Handle game over - could navigate to results page
    console.log('Game Over');
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* Guest mode warning banner */}
      {isGuest && (
        <div style={{
          backgroundColor: '#ffc107',
          color: '#000',
          padding: '12px 20px',
          textAlign: 'center',
          fontWeight: '600',
          fontSize: '14px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          🎮 Playing as Guest - Your scores won't be saved.
          <Link
            to="/register"
            style={{
              marginLeft: '10px',
              color: '#667eea',
              textDecoration: 'underline',
              fontWeight: 'bold'
            }}
          >
            Sign up to save your progress!
          </Link>
        </div>
      )}

      <div style={{
        position: 'absolute',
        top: isGuest ? '60px' : '10px',
        right: '10px',
        display: 'flex',
        gap: '10px',
        zIndex: 100
      }}>
        <button
          onClick={() => navigate('/leaderboard')}
          style={{
            padding: '10px 20px',
            backgroundColor: '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600'
          }}
        >
          Leaderboard
        </button>
        {isGuest ? (
          <button
            onClick={handleBackHome}
            style={{
              padding: '10px 20px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600'
            }}
          >
            Back to Home
          </button>
        ) : (
          <button
            onClick={handleLogout}
            style={{
              padding: '10px 20px',
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
        )}
      </div>

      <GameBoard
        level={currentLevel}
        onLevelComplete={handleLevelComplete}
        onGameOver={handleGameOver}
      />
    </div>
  );
};

export default Game;