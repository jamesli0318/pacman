import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Home: React.FC = () => {
  const { isAuthenticated, playAsGuest } = useAuth();
  const navigate = useNavigate();

  const handleGuestPlay = () => {
    playAsGuest();
    navigate('/game');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      textAlign: 'center',
      padding: '20px'
    }}>
      <h1 style={{ fontSize: '48px', marginBottom: '20px', fontWeight: 'bold' }}>
        🎮 Pacman Game
      </h1>
      <p style={{ fontSize: '20px', marginBottom: '40px', maxWidth: '600px' }}>
        Classic Pacman with AI ghosts, 10 challenging levels, and competitive leaderboards!
      </p>

      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {isAuthenticated ? (
          <Link
            to="/game"
            style={{
              padding: '16px 32px',
              backgroundColor: 'white',
              color: '#667eea',
              textDecoration: 'none',
              borderRadius: '10px',
              fontSize: '18px',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
            }}
          >
            Play Now
          </Link>
        ) : (
          <>
            <Link
              to="/login"
              style={{
                padding: '16px 32px',
                backgroundColor: 'white',
                color: '#667eea',
                textDecoration: 'none',
                borderRadius: '10px',
                fontSize: '18px',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
              }}
            >
              Login
            </Link>
            <Link
              to="/register"
              style={{
                padding: '16px 32px',
                backgroundColor: 'rgba(255,255,255,0.2)',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '10px',
                fontSize: '18px',
                fontWeight: '600',
                border: '2px solid white',
                transition: 'all 0.3s ease'
              }}
            >
              Register
            </Link>
            <button
              onClick={handleGuestPlay}
              style={{
                padding: '16px 32px',
                backgroundColor: 'transparent',
                color: 'white',
                border: '2px solid rgba(255,255,255,0.5)',
                borderRadius: '10px',
                fontSize: '18px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
                e.currentTarget.style.borderColor = 'white';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)';
              }}
            >
              🎮 Play as Guest
            </button>
          </>
        )}
      </div>

      <div style={{ marginTop: '60px', maxWidth: '800px' }}>
        <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>Features</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          <div style={{ padding: '20px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px' }}>
            <h3>👻 AI Ghosts</h3>
            <p style={{ fontSize: '14px' }}>Four unique ghost behaviors</p>
          </div>
          <div style={{ padding: '20px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px' }}>
            <h3>🎯 10 Levels</h3>
            <p style={{ fontSize: '14px' }}>Progressive difficulty</p>
          </div>
          <div style={{ padding: '20px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px' }}>
            <h3>🏆 Leaderboard</h3>
            <p style={{ fontSize: '14px' }}>Compete with players</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;