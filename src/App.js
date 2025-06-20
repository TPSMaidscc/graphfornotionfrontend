import React, { useState, useEffect } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Handle,
  Position
} from 'reactflow';
import 'reactflow/dist/style.css';

// ===== CONFIGURATION =====
const SERVER_URL = 'https://backendfornotiongraph.vercel.app'; // Your Vercel backend

// Enhanced Custom node component optimized for wide spacing and deep structures
const CustomNode = ({ data, isConnectable }) => {
  const getNodeIcon = (nodeType) => {
    switch (nodeType) {
      default: return '';
    }
  };

  const getNodeStyle = (nodeType, depth = 0) => {
    // Base styles with depth-aware adjustments
    const baseStyle = {
      border: 'none',
      borderRadius: '12px',
      fontWeight: '600',
      textAlign: 'center',
      position: 'relative',
      cursor: 'default',
      wordWrap: 'break-word',
      whiteSpace: 'normal',
      lineHeight: '1.4'
    };

    // Adjust sizes based on depth for better hierarchy visualization
    const depthScale = Math.max(0.8, 1 - (depth * 0.05)); // Slightly smaller for deeper nodes
    const basePadding = 18;
    const scaledPadding = Math.max(12, basePadding * depthScale);

    switch (nodeType) {
      case 'businessTool':
        return {
          ...baseStyle,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          fontSize: `${16 * depthScale}px`,
          fontWeight: '700',
      //    padding: `${scaledPadding + 4}px ${scaledPadding + 8}px`,
          minWidth: `${100 * depthScale}px`,
          maxWidth: `${400 * depthScale}px`,
        //  boxShadow: '0 10px 30px rgba(102, 126, 234, 0.4)',
          color: 'white',
          transform: `scale(${Math.max(0.9, depthScale + 0.1)})` // Slightly larger for root
        };
      case 'businessECP':
        return {
          ...baseStyle,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          fontSize: `${16 * depthScale}px`,
          fontWeight: '700',
        //  padding: `${scaledPadding + 4}px ${scaledPadding + 8}px`,
          minWidth: `${100 * depthScale}px`,
          maxWidth: `${400 * depthScale}px`,
       //   boxShadow: '0 10px 30px rgba(102, 126, 234, 0.4)',
          color: 'white',
          transform: `scale(${Math.max(0.9, depthScale + 0.1)})` // Slightly larger for root
        };
      case 'condition':
        return {
          ...baseStyle,
          background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
          fontSize: `${14 * depthScale}px`,
      //    padding: `${scaledPadding}px ${scaledPadding + 4}px`,
          minWidth: `${60 * depthScale}px`,
          maxWidth: `${320 * depthScale}px`,
       //   boxShadow: '0 8px 25px rgba(246, 173, 85, 0.35)',
          color: '#8b4513',
          transform: `scale(${depthScale})`
        };
      case 'event':
        return {
          ...baseStyle,
          background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
          fontSize: `${14 * depthScale}px`,
        //  padding: `${scaledPadding}px ${scaledPadding + 4}px`,
          minWidth: `${60 * depthScale}px`,
          maxWidth: `${320 * depthScale}px`,
      //    boxShadow: '0 8px 25px rgba(79, 209, 199, 0.35)',
          color: '#2d3748',
          transform: `scale(${depthScale})`
        };
      case 'policy':
        return {
          ...baseStyle,
          background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
          fontSize: `${14 * depthScale}px`,
   //       padding: `${scaledPadding}px ${scaledPadding + 4}px`,
          minWidth: `${60 * depthScale}px`,
          maxWidth: `${320 * depthScale}px`,
  //        boxShadow: '0 8px 25px rgba(79, 209, 199, 0.35)',
          color: '#2d3748',
          transform: `scale(${depthScale})`
        };
      case 'jsonCode':
        return {
          ...baseStyle,
          background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
          fontSize: `${14 * depthScale}px`,
    //      padding: `${scaledPadding}px ${scaledPadding + 4}px`,
          minWidth: `${60 * depthScale}px`,
          maxWidth: `${320 * depthScale}px`,
 //         boxShadow: '0 8px 25px rgba(255, 154, 158, 0.35)',
          color: '#7c2d12',
          transform: `scale(${depthScale})`
        };
      default:
        return {
          ...baseStyle,
          background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)',
          fontSize: `${13 * depthScale}px`,
      //    padding: `${scaledPadding}px ${scaledPadding + 4}px`,
          minWidth: `${200 * depthScale}px`,
          maxWidth: `${300 * depthScale}px`,
      //    boxShadow: '0 6px 20px rgba(165, 180, 252, 0.3)',
          color: '#3730a3',
          transform: `scale(${depthScale})`
        };
    }
  };

  const nodeStyle = getNodeStyle(data.nodeType, data.depth);
  const icon = getNodeIcon(data.nodeType);

  return (
    <div 
      style={nodeStyle}
      className="custom-node"
      title={`${data.originalContent || data.label} (Depth: ${data.depth || 0})`}
    >
      <div style={{ 
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        justifyContent: 'center',
        flexWrap: 'wrap'
      }}>
        <span style={{ 
          fontSize: '20px', 
          flexShrink: 0,
          opacity: 0.9
        }}>
          {icon}
        </span>
        <div style={{ 
          flex: 1, 
          minWidth: '120px',
          textAlign: 'center'
        }}>
          {data.label}
        </div>
      </div>
      
      {/* Enhanced depth indicator */}
      {data.depth !== undefined && data.depth > 0 && (
        <div style={{
          position: 'absolute',
          top: '-8px',
          right: '-8px',
          background: 'rgba(0,0,0,0.7)',
          color: 'white',
          borderRadius: '50%',
          width: '18px',
          height: '18px',
          fontSize: '11px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          border: '2px solid white',
          boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
        }}>
          {data.depth}
        </div>
      )}
      
      
      
      {/* Enhanced connection handles for better arrow visibility */}
      <Handle
        type="target"
        position={Position.Top}
        style={{ 
          background: '#64748b', 
        //  border: '3px solid white',
          width: '0px',
          height: '0px',
          top: '0px',
         // boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
        }}
        isConnectable={isConnectable}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ 
          background: '#64748b', 
         // border: '3px solid white',
          width: '0px',
          height: '0px',
          bottom: '0px',
         // boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
        }}
        isConnectable={isConnectable}
      />
    </div>
  );
};

// Node types configuration
const nodeTypes = {
  custom: CustomNode,
  default: CustomNode,
};

// Enhanced default graph for better demo with Business Tool example
const defaultGraph = {
  nodes: [
    { 
      id: '1', 
      position: { x: 0, y: 0 }, 
      data: { 
        label: '🛠️ Default Business Tool', 
        nodeType: 'businessTool',
        storage: 'default',
        depth: 0
      },
      type: 'custom'
    },
    { 
      id: '2', 
      position: { x: -200, y: 200 }, 
      data: { 
        label: '❓ Sample Condition', 
        nodeType: 'condition',
        storage: 'default',
        depth: 1
      },
      type: 'custom'
    },
    { 
      id: '3', 
      position: { x: 200, y: 200 }, 
      data: { 
        label: '📅 Sample Event', 
        nodeType: 'event',
        storage: 'default',
        depth: 1
      },
      type: 'custom'
    },
    { 
      id: '4', 
      position: { x: 0, y: 400 }, 
      data: { 
        label: '💻 JSON Code Required', 
        nodeType: 'jsonCode',
        storage: 'default',
        depth: 2
      },
      type: 'custom'
    }
  ],
  edges: [
    { 
      id: 'e1-2', 
      source: '1', 
      target: '2', 
      type: 'smoothstep',
      style: { stroke: '#a5b4fc', strokeWidth: 2 },
      markerEnd: { type: 'arrowclosed', color: '#a5b4fc' }
    },
    { 
      id: 'e1-3', 
      source: '1', 
      target: '3', 
      type: 'smoothstep',
      style: { stroke: '#4fd1c7', strokeWidth: 2, strokeDasharray: '8,4' },
      markerEnd: { type: 'arrowclosed', color: '#4fd1c7' }
    },
    { 
      id: 'e3-4', 
      source: '3', 
      target: '4', 
      type: 'smoothstep',
      style: { stroke: '#ff9a9e', strokeWidth: 2, strokeDasharray: '5,5' },
      markerEnd: { type: 'arrowclosed', color: '#ff9a9e' }
    }
  ]
};

// ===== UTILITY FUNCTIONS =====

const getPageFromUrl = () => {
  const params = new URLSearchParams(window.location.search);
  return params.get('page') || null;
};

const fetchGraphDataFromServer = async (pageId) => {
  try {
    console.log(`🔍 Fetching graph data from server for page: ${pageId}`);
    console.log(`🌐 Server URL: ${SERVER_URL}/api/graph-data/${pageId}`);
    
    const response = await fetch(`${SERVER_URL}/api/graph-data/${pageId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      mode: 'cors' // Enable CORS
    });
    
    console.log(`📊 Response status: ${response.status}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        console.warn(`📄 Graph data not found for page: ${pageId}`);
        return null;
      }
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('✅ Successfully fetched graph data:', {
      success: data.success,
      nodes: data.nodes?.length,
      edges: data.edges?.length,
      pageId: data.pageId,
      storage: data.storage,
      maxDepth: data.metadata?.maxDepth,
      nodeTypes: data.metadata?.nodeTypes
    });
    
    return data;
  } catch (error) {
    console.error('❌ Failed to fetch graph data:', error);
    return null;
  }
};

// ===== MAIN COMPONENT =====

function GraphApp() {
  const currentPage = getPageFromUrl();
  
  // State management
  const [graphData, setGraphData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dataSource, setDataSource] = useState('unknown');
  const [graphType, setGraphType] = useState('unknown');
  
  // React Flow hooks - must be called unconditionally
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  
  // Load graph data on mount
  useEffect(() => {
    const loadGraphData = async () => {
      console.log(`🚀 Loading graph data for page: ${currentPage}`);
      
      if (!currentPage) {
        console.log('📭 No page ID in URL, using default graph');
        setGraphData(defaultGraph);
        setDataSource('default');
        setGraphType('businessTool');
        setLoading(false);
        return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
        const serverData = await fetchGraphDataFromServer(currentPage);
        
        if (serverData && serverData.success) {
          console.log('✅ Using server data');
          setGraphData(serverData);
          setDataSource(serverData.storage || 'server');
          
          // Determine graph type from node types and actual nodes
          const nodeTypes = serverData.metadata?.nodeTypes || {};
          const nodes = serverData.nodes || [];
          
          // Check actual node data for better detection
          const hasBusinessTool = nodes.some(node => 
            node.data?.nodeType === 'businessTool' || 
            node.data?.label?.includes('Business Tool')
          );
          const hasBusinessECP = nodes.some(node => 
            node.data?.nodeType === 'businessECP' || 
            node.data?.label?.includes('Business ECP')
          );
          
          if (hasBusinessTool && nodeTypes.businessTool > 0) {
            setGraphType('businessTool');
          } else if (hasBusinessECP && nodeTypes.businessECP > 0) {
            setGraphType('businessECP');
          } else if (nodeTypes.businessECP > 0 || nodeTypes.policies > 0) {
            // Fallback: if we have policies, it's likely a Business ECP
            setGraphType('businessECP');
          } else if (nodeTypes.businessTool > 0 || nodeTypes.events > 0) {
            // Fallback: if we have events, it's likely a Business Tool
            setGraphType('businessTool');
          } else {
            setGraphType('mixed');
          }
        } else {
          console.log('📦 Server data not available, using default');
          setGraphData(defaultGraph);
          setDataSource('default-fallback');
          setGraphType('businessTool');
        }
      } catch (err) {
        console.error('❌ Error loading graph data:', err);
        setError(err.message);
        setGraphData(defaultGraph);
        setDataSource('error-fallback');
        setGraphType('businessTool');
      } finally {
        setLoading(false);
      }
    };
    
    loadGraphData();
  }, [currentPage]);
  
  // Update React Flow nodes and edges when data changes
  useEffect(() => {
    if (graphData) {
      console.log(`🔄 Updating React Flow with data from: ${dataSource}`);
      
      // Process nodes and ensure they have the correct structure
      const processedNodes = (graphData.nodes || []).map(node => ({
        ...node,
        type: 'custom',
        data: {
          ...node.data,
          storage: dataSource,
          // Ensure depth is available for styling
          depth: node.data?.depth !== undefined ? node.data.depth : 0
        }
      }));
      
      // Process edges with enhanced styling for better visibility in wide layouts
      const processedEdges = (graphData.edges || []).map(edge => ({
        ...edge,
        type: 'smoothstep',
        style: {
          ...edge.style,
          strokeWidth: edge.style?.strokeWidth || 2,
          stroke: edge.style?.stroke || '#64748b'
        },
        markerEnd: {
          type: 'arrowclosed',
          color: edge.style?.stroke || '#64748b',
          width: 20,
          height: 20
        }
      }));
      
      console.log(`📊 Setting ${processedNodes.length} nodes and ${processedEdges.length} edges`);
      console.log(`🛠️ Graph type: ${graphType}`);
      
      setNodes(processedNodes);
      setEdges(processedEdges);
    }
  }, [graphData, dataSource, setNodes, setEdges]);

  // Debug information
  const debugInfo = {
    currentPage,
    dataSource,
    graphType,
    nodeCount: nodes.length,
    edgeCount: edges.length,
    hasGraphData: !!graphData,
    maxDepth: graphData?.metadata?.maxDepth || 0,
    nodeTypes: graphData?.metadata?.nodeTypes,
    serverUrl: SERVER_URL
  };

  // Loading state with enhanced messaging
  if (loading) {
    return (
      <div style={{ 
        width: '100vw', 
        height: '100vh',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '24px'
      }}>
        <div style={{
          width: '70px',
          height: '70px',
          border: '5px solid #e2e8f0',
          borderTop: '5px solid #3b82f6',
          borderRadius: '50%',
          animation: 'spin 1.2s linear infinite'
        }}></div>
        <div style={{ color: '#64748b', fontSize: '18px', fontWeight: '600' }}>
          Loading graph data...
        </div>
        <div style={{ color: '#94a3b8', fontSize: '14px', textAlign: 'center' }}>
          <div>Page: {currentPage || 'No page specified'}</div>
          <div style={{ marginTop: '4px', fontSize: '12px' }}>
            Supporting Business Tools, ECPs, Events, Conditions & JSON Code
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
  }
  
  // Error state
  if (error && !graphData) {
    return (
      <div style={{ 
        width: '100vw', 
        height: '100vh',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <div style={{ color: '#ef4444', fontSize: '24px', fontWeight: '700' }}>
          ❌ Error Loading Graph
        </div>
        <div style={{ color: '#64748b', fontSize: '16px', textAlign: 'center', maxWidth: '500px' }}>
          {error}
        </div>
        <div style={{ color: '#94a3b8', fontSize: '12px' }}>
          Page: {currentPage} | Source: {dataSource} | Type: {graphType}
        </div>
        <button 
          onClick={() => window.location.reload()} 
          style={{
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            padding: '14px 28px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '16px'
          }}
        >
          🔄 Retry
        </button>
      </div>
    );
  }

  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      position: 'relative'
    }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={true} // Allow selection for better UX
        selectNodesOnDrag={false}
        panOnDrag={true}
        zoomOnScroll={true}
        zoomOnPinch={true}
        panOnScroll={false}
        fitView
        fitViewOptions={{
          padding: 0.15, // Reduced padding for wide layouts
          minZoom: 0.1,  // Allow more zoom out for wide structures
          maxZoom: 1.5,
          includeHiddenNodes: false
        }}
        // Enhanced connection line styling
        connectionLineStyle={{ stroke: '#64748b', strokeWidth: 2 }}
        connectionLineType="smoothstep"
      >
        <Background 
          variant="dots" 
          gap={40}  // Increased gap for wide layouts
          size={2}  // Slightly larger dots
          color="#cbd5e1"
        />
        <Controls 
          style={{
            background: 'rgba(255, 255, 255, 0.95)',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
            padding: '4px'
          }}
          showInteractive={false} // Hide since we disabled interactions
        />
        
      </ReactFlow>
      
      {/* Graph Type Indicator */}
      <div style={{
        position: 'absolute',
        top: '15px',
        right: '15px',
        background: 'rgba(255, 255, 255, 0.98)',
        padding: '12px 16px',
        borderRadius: '10px',
        border: '1px solid #e2e8f0',
        fontSize: '14px',
        fontWeight: '600',
        color: '#1e293b',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
        backdropFilter: 'blur(10px)'
      }}>
        {graphType === 'businessTool' && '🛠️ Business Tool'}
        {graphType === 'businessECP' && '🏢 Business ECP'}
        {graphType === 'mixed' && '🔄 Mixed Structure'}
        {graphType === 'unknown' && '📊 Graph Structure'}
      </div>
      
    </div>
  );
}

export default GraphApp;