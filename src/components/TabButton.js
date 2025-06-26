import React from 'react';

// ===== TAB COMPONENT =====
const TabButton = ({ children, isActive, onClick, disabled = false }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    style={{
      padding: '12px 24px',
      border: 'none',
      borderRadius: '12px 12px 0 0',
      background: isActive 
        ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
        : disabled 
        ? '#f1f5f9' 
        : '#e2e8f0',
      color: isActive ? 'white' : disabled ? '#94a3b8' : '#475569',
      fontSize: '16px',
      fontWeight: isActive ? '700' : '600',
      cursor: disabled ? 'not-allowed' : 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: isActive ? '0 4px 12px rgba(102, 126, 234, 0.3)' : 'none',
      transform: isActive ? 'translateY(-2px)' : 'none',
      opacity: disabled ? 0.6 : 1
    }}
  >
    {children}
  </button>
);

export default TabButton;