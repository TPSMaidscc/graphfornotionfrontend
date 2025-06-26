import React from 'react';

const DebugOverlay = ({ debugInfo }) => {
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div style={{
      position: 'absolute',
      top: '80px',
      left: '10px',
      background: 'rgba(0,0,0,0.8)',
      color: 'white',
      padding: '10px',
      borderRadius: '8px',
      fontSize: '12px',
      maxWidth: '300px',
      zIndex: 1000
    }}>
      <div>Active Tab: {debugInfo.activeTab}</div>
      <div>Layout Config: {JSON.stringify(debugInfo.layoutConfig)}</div>
      <div>Nodes: {debugInfo.activeTab === 'technical' ? debugInfo.technicalNodeCount : debugInfo.humanizedNodeCount}</div>
      <div>Source: {debugInfo.dataSource}</div>
      <div>🤖 AI Titles: {debugInfo.hasAITitles ? `${debugInfo.aiGeneratedCount} nodes` : 'None'}</div>
      {debugInfo.activeTab === 'humanized' && debugInfo.humanizedCount > 0 && (
        <div>👤 Humanized: {debugInfo.humanizedCount} conditions</div>
      )}
    </div>
  );
};

export default DebugOverlay;