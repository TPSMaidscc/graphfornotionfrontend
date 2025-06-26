import React from 'react';

const HumanizedLoading = () => {
  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: '24px',
      background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)'
    }}>
      <div style={{
        width: '60px',
        height: '60px',
        border: '4px solid rgba(255, 255, 255, 0.3)',
        borderTop: '4px solid #ffffff',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }}></div>
      <div style={{ color: 'white', fontSize: '20px', fontWeight: '700', textAlign: 'center' }}>
        🤖 Creating Humanized Graph...
      </div>
      <div style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '16px', textAlign: 'center' }}>
        AI is humanizing technical conditions for better understanding
      </div>
    </div>
  );
};

export default HumanizedLoading;