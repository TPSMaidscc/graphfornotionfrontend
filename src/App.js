import React, { useState } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background
} from 'reactflow';
import 'reactflow/dist/style.css';

// Components
import CustomNode from './components/CustomNode.js';
import TabButton from './components/TabButton.js';
import LoadingScreen from './components/LoadingScreen.js';
import ErrorScreen from './components/ErrorScreen.js';
import HumanizedLoading from './components/HumanizedLoading.js';
import HumanizedNotAvailable from './components/HumanizedNotAvailable.js';
import DebugOverlay from './components/DebugOverlay.js';
import { NodeExpansionProvider, useNodeExpansion } from './components/NodeExpansionContext.js';

// Hooks
import { useGraphData } from './hooks/useGraphData.js';
import { useFlowState } from './hooks/useFlowState.js';

// Utils
import { getPageFromUrl } from './utils/helpers.js';
import { SERVER_URL } from './config/constants.js';

// Node types configuration
const nodeTypes = {
  custom: CustomNode,
  default: CustomNode,
};

// Inner component that uses the context
function GraphAppInner() {
  const currentPage = getPageFromUrl();
  const [activeTab, setActiveTab] = useState('technical');
  const { collapseNode, expandedNodeId } = useNodeExpansion();

  // Custom hooks
  const {
    technicalGraphData,
    humanizedGraphData,
    loading,
    error,
    dataSource,
    graphType,
    humanizedLoading,
    loadHumanizedGraphData
  } = useGraphData(currentPage);

  const {
    technicalNodes,
    technicalEdges,
    onTechnicalNodesChange,
    onTechnicalEdgesChange,
    humanizedNodes,
    humanizedEdges,
    onHumanizedNodesChange,
    onHumanizedEdgesChange
  } = useFlowState(technicalGraphData, humanizedGraphData, dataSource, expandedNodeId);

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    collapseNode(); // Collapse any expanded node when switching tabs
    if (tab === 'humanized' && !humanizedGraphData && !humanizedLoading) {
      loadHumanizedGraphData();
    }
  };

  // Handle clicks on the ReactFlow pane (background) to collapse nodes
  const handlePaneClick = (event) => {
    collapseNode();
  };

  // Handle node clicks to collapse when clicking on ReactFlow background
  const handleNodeClick = (event, node) => {
    // This is handled in CustomNode, but we prevent default here
    event.stopPropagation();
  };

  // Get current graph data based on active tab
  const getCurrentGraphData = () => {
    return activeTab === 'technical' ? technicalGraphData : humanizedGraphData;
  };

  const getCurrentNodes = () => {
    return activeTab === 'technical' ? technicalNodes : humanizedNodes;
  };

  const getCurrentEdges = () => {
    return activeTab === 'technical' ? technicalEdges : humanizedEdges;
  };

  const getCurrentNodesChange = () => {
    return activeTab === 'technical' ? onTechnicalNodesChange : onHumanizedNodesChange;
  };

  const getCurrentEdgesChange = () => {
    return activeTab === 'technical' ? onTechnicalEdgesChange : onHumanizedEdgesChange;
  };

  // Debug information
  const debugInfo = {
    currentPage,
    activeTab,
    dataSource,
    graphType,
    technicalNodeCount: technicalNodes.length,
    technicalEdgeCount: technicalEdges.length,
    humanizedNodeCount: humanizedNodes.length,
    humanizedEdgeCount: humanizedEdges.length,
    hasTechnicalGraphData: !!technicalGraphData,
    hasHumanizedGraphData: !!humanizedGraphData,
    maxDepth: getCurrentGraphData()?.metadata?.maxDepth || 0,
    nodeTypes: getCurrentGraphData()?.metadata?.nodeTypes,
    layoutConfig: getCurrentGraphData()?.metadata?.layout,
    serverUrl: SERVER_URL,
    hasAITitles: getCurrentGraphData()?.hasAITitles || false,
    aiGeneratedCount: getCurrentGraphData()?.aiGeneratedCount || 0,
    humanizedCount: getCurrentGraphData()?.humanizedCount || 0
  };

  // Enhanced loading state
  if (loading) {
    return <LoadingScreen currentPage={currentPage} />;
  }
 
  // Enhanced error state
  if (error && !technicalGraphData) {
    return (
      <ErrorScreen 
        error={error}
        currentPage={currentPage}
        dataSource={dataSource}
        graphType={graphType}
      />
    );
  }

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      background: 'white',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Tab Navigation */}
      <div style={{
        background: '#f8fafc',
        borderBottom: '1px solid #e2e8f0',
        padding: '16px 24px',
        display: 'flex',
        gap: '8px',
        alignItems: 'center',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
      }}>
        <TabButton
          isActive={activeTab === 'technical'}
          onClick={() => handleTabChange('technical')}
        >
          🔧 Technical Graph
        </TabButton>
        
        <TabButton
          isActive={activeTab === 'humanized'}
          onClick={() => handleTabChange('humanized')}
          disabled={!currentPage}
        >
          👤 Humanized Graph
          {humanizedLoading && (
            <span style={{ marginLeft: '8px', fontSize: '12px' }}>
              ⏳ Loading...
            </span>
          )}
        </TabButton>

        {/* Info Display */}
        <div style={{
          marginLeft: 'auto',
          display: 'flex',
          gap: '16px',
          alignItems: 'center',
          fontSize: '14px',
          color: '#64748b'
        }}>
         
        </div>
      </div>

      {/* Graph Content */}
      <div style={{ flex: 1, position: 'relative' }}>
        {activeTab === 'humanized' && humanizedLoading ? (
          <HumanizedLoading />
        ) : activeTab === 'humanized' && !humanizedGraphData ? (
          <HumanizedNotAvailable 
            currentPage={currentPage}
            onRetry={loadHumanizedGraphData}
          />
        ) : (
          <ReactFlow
            nodes={getCurrentNodes()}
            edges={getCurrentEdges()}
            nodeTypes={nodeTypes}
            onNodesChange={getCurrentNodesChange()}
            onEdgesChange={getCurrentEdgesChange()}
            onPaneClick={handlePaneClick}
            onNodeClick={handleNodeClick}
            nodesDraggable={false}
            nodesConnectable={false}
            elementsSelectable={true}
            selectNodesOnDrag={false}
            panOnDrag={true}
            zoomOnScroll={true}
            zoomOnPinch={true}
            panOnScroll={false}
            fitView
            fitViewOptions={{
              padding: 0.1,
              minZoom: 0.1,
              maxZoom: 10,
              includeHiddenNodes: true
            }}
            connectionLineStyle={{ stroke: '#4878bc', strokeWidth: 2 }}
            connectionLineType="smoothstep"
          >
            <Background
              variant="dots"
              gap={50}
              size={2}
              color="#e5e7eb"
              style={{ opacity: 0.5 }}
            />
            <Controls
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                padding: '6px'
              }}
              showInteractive={false}
            />
          </ReactFlow>
        )}
      </div>
      
      {/* Enhanced Debug info overlay */}
      <DebugOverlay debugInfo={debugInfo} />
    </div>
  );
}

// Main component with context provider
function GraphApp() {
  return (
    <NodeExpansionProvider>
      <GraphAppInner />
    </NodeExpansionProvider>
  );
}

export default GraphApp;