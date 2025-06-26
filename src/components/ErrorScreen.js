import React from 'react';

const ErrorScreen = ({ error, currentPage, dataSource, graphType }) => {
  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: '24px'
    }}>
      <div style={{ color: 'white', fontSize: '28px', fontWeight: '700' }}>
        ❌ Error Loading Enhanced Graph
      </div>
      <div style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '18px', textAlign: 'center', maxWidth: '600px' }}>
        {error}
      </div>
      <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>
        Page: {currentPage} | Source: {dataSource} | Type: {graphType}
      </div>
      <button
        onClick={() => window.location.reload()}
        style={{
          background: 'rgba(255, 255, 255, 0.2)',
          color: 'white',
          border: '2px solid white',
          padding: '16px 32px',
          borderRadius: '12px',
          cursor: 'pointer',
          fontWeight: '700',
          fontSize: '18px',
          backdropFilter: 'blur(10px)'
        }}
      >
        🔄 Retry Loading
      </button>
    </div>
  );
};

export default ErrorScreen;