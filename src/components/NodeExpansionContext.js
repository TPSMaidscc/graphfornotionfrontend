import React, { createContext, useContext, useState } from 'react';

const NodeExpansionContext = createContext();

export const NodeExpansionProvider = ({ children }) => {
  const [expandedNodeId, setExpandedNodeId] = useState(null);

  const expandNode = (nodeId) => {
    setExpandedNodeId(nodeId);
  };

  const collapseNode = () => {
    setExpandedNodeId(null);
  };

  const isNodeExpanded = (nodeId) => {
    return expandedNodeId === nodeId;
  };

  return (
    <NodeExpansionContext.Provider value={{
      expandedNodeId,
      expandNode,
      collapseNode,
      isNodeExpanded
    }}>
      {children}
    </NodeExpansionContext.Provider>
  );
};

export const useNodeExpansion = () => {
  const context = useContext(NodeExpansionContext);
  if (!context) {
    throw new Error('useNodeExpansion must be used within a NodeExpansionProvider');
  }
  return context;
};