import React from 'react';

const HumanizedNotAvailable = ({ currentPage, onRetry }) => {
  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: '24px',
      background: '#f1f5f9'
    }}>
      <div style={{ fontSize: '48px' }}>👤</div>
      <div style={{ color: '#475569', fontSize: '20px', fontWeight: '600', textAlign: 'center' }}>
        Humanized Graph Not Available
      </div>
      <div style={{ color: '#64748b', fontSize: '16px', textAlign: 'center', maxWidth: '400px' }}>
        {!currentPage 
          ? 'No page specified in URL. The humanized graph is only available for specific Notion pages.'
          : 'Failed to load or create the humanized version of this graph.'
        }
      </div>
      {currentPage && (
        <button
          onClick={onRetry}
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '16px'
          }}
        >
          🔄 Try Again
        </button>
      )}
    </div>
  );
};

export default HumanizedNotAvailable;