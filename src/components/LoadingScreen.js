import React from 'react';

const LoadingScreen = ({ currentPage }) => {
  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: '32px'
    }}>
      <div style={{
        width: '80px',
        height: '80px',
        border: '6px solid rgba(255, 255, 255, 0.3)',
        borderTop: '6px solid #ffffff',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }}></div>
      <div style={{ color: 'white', fontSize: '22px', fontWeight: '700', textAlign: 'center' }}>
        Loading Enhanced Graph Visualization...
      </div>
      <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '16px', textAlign: 'center', maxWidth: '400px' }}>
        <div>Page: {currentPage || 'Default Complex Demo'}</div>
        <div style={{ marginTop: '8px', fontSize: '14px' }}>
          Supporting Technical & Humanized Views with AI Summaries
        </div>
      </div>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;