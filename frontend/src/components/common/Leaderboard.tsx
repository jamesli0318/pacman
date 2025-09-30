import React from 'react';
import { useNavigate } from 'react-router-dom';

const Leaderboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h1>Leaderboard</h1>
      <p style={{ color: '#666', marginTop: '20px' }}>
        Leaderboard implementation coming in Phase 8!
      </p>

      <button
        onClick={() => navigate('/game')}
        style={{
          marginTop: '30px',
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
        Back to Game
      </button>
    </div>
  );
};

export default Leaderboard;