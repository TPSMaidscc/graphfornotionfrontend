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


// Enhanced Custom node component with fixed dimensions from backend
// Enhanced Custom node component with dynamic expansion
const CustomNode = ({ data, isConnectable }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
 
  const getNodeIcon = (nodeType) => {
    return '';
  };

  // Function to calculate dynamic dimensions based on text
  const calculateDynamicSize = (text, isExpanded, baseWidth = 200, baseHeight = 100) => {
    if (!isExpanded) {
      return { width: baseWidth, height: baseHeight };
    }

    // Estimate text dimensions
    const averageCharWidth = 8; // Approximate pixels per character
    const lineHeight = 20; // Approximate pixels per line
    const padding = 20; // Total padding
    const maxWidth = 400; // Maximum width before wrapping
    
    // Calculate width needed
    const textLength = text.length;
    const estimatedWidth = Math.min(textLength * averageCharWidth + padding, maxWidth);
    
    // Calculate height needed based on text wrapping
    const charsPerLine = Math.floor((estimatedWidth - padding) / averageCharWidth);
    const estimatedLines = Math.ceil(textLength / charsPerLine);
    const estimatedHeight = Math.max(baseHeight, estimatedLines * lineHeight + padding + 40); // +40 for expand hint
    
    return {
      width: Math.max(baseWidth, estimatedWidth),
      height: Math.max(baseHeight, estimatedHeight)
    };
  };

  const getNodeStyle = (nodeType, depth = 0) => {
    // Calculate dynamic size based on expansion state
    const fullText = data.originalContent || data.label || '';
    const { width, height } = calculateDynamicSize(fullText, isExpanded, 200, 100);
    
    // Enhanced base styles with dynamic dimensions
    const baseStyle = {
      border: 'none',
      borderRadius: '16px',
      fontWeight: '600',
      textAlign: 'center',
      position: 'relative',
      cursor: 'pointer', // Always clickable
      wordWrap: 'break-word',
      whiteSpace: 'normal',
      lineHeight: '1.4',
      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      backdropFilter: 'blur(8px)',
      width: `${width}px`,
      height: `${height}px`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: isExpanded ? '15px' : '10px',
      transformOrigin: 'center center',
      zIndex: isExpanded ? 1000 : 1, // Bring expanded nodes to front
      overflow: 'hidden'
    };

    // Enhanced depth scaling
    const depthScale = Math.max(0.75, 1 - (depth * 0.04));
    const shadowIntensity = Math.max(0.2, 0.5 - (depth * 0.05));
   
    switch (nodeType) {
      case 'businessTool':
        return {
          ...baseStyle,
          background: '#27a567',
          fontSize: `${Math.max(12, isExpanded ? 16 : 17 * depthScale)}px`,
          fontWeight: '700',
          boxShadow: isExpanded 
            ? `0 25px 80px rgba(39, 165, 103, 0.4)` 
            : `0 12px 35px rgba(102, 126, 234, ${shadowIntensity})`,
          color: 'white',
          border: '3px solid rgba(0, 0, 0, 0.1)'
        };
      case 'businessECP':
        return {
          ...baseStyle,
          background: '#27a567',
          fontSize: `${Math.max(12, isExpanded ? 16 : 17 * depthScale)}px`,
          fontWeight: '700',
          boxShadow: isExpanded 
            ? `0 25px 80px rgba(39, 165, 103, 0.4)` 
            : `0 12px 35px rgba(102, 126, 234, ${shadowIntensity})`,
          color: 'white',
          border: '3px solid rgba(0, 0, 0, 0.1)'
        };
      case 'condition':
        return {
          ...baseStyle,
          background: '#4878bc',
          fontSize: `${Math.max(12, isExpanded ? 14 : 15 * depthScale)}px`,
          boxShadow: isExpanded 
            ? `0 25px 80px rgba(72, 120, 188, 0.4)` 
            : `0 10px 28px rgba(30, 58, 138, ${shadowIntensity})`,
          color: 'white',
          border: '2px solid rgba(255, 255, 255, 0.2)'
        };
      case 'event':
        return {
          ...baseStyle,
          background: '#fed7aa',
          fontSize: `${Math.max(12, isExpanded ? 14 : 15 * depthScale)}px`,
          boxShadow: isExpanded 
            ? `0 25px 80px rgba(254, 215, 170, 0.4)` 
            : `0 10px 28px rgba(0, 0, 0, 0.15)`,
          color: 'black',
          border: '2px solid rgba(0, 0, 0, 0.2)'
        };
      case 'policy':
        return {
          ...baseStyle,
          background: '#fed7aa',
          fontSize: `${Math.max(12, isExpanded ? 14 : 15 * depthScale)}px`,
          boxShadow: isExpanded 
            ? `0 25px 80px rgba(254, 215, 170, 0.4)` 
            : `0 10px 28px rgba(254, 215, 170, ${shadowIntensity})`,
          color: 'black',
          border: '2px solid rgba(0, 0, 0, 0.1)'
        };
      case 'jsonCode':
        return {
          ...baseStyle,
          background: 'white',
          fontSize: `${Math.max(12, isExpanded ? 14 : 15 * depthScale)}px`,
          boxShadow: isExpanded 
            ? `0 25px 80px rgba(0, 0, 0, 0.3)` 
            : `0 10px 28px rgba(0, 0, 0, 0.15)`,
          color: 'black',
          border: '2px solid rgba(0, 0, 0, 0.2)'
        };
      default:
        return {
          ...baseStyle,
          background: 'white',
          fontSize: `${Math.max(12, isExpanded ? 14 : 14 * depthScale)}px`,
          boxShadow: isExpanded 
            ? `0 25px 80px rgba(0, 0, 0, 0.3)` 
            : `0 8px 22px rgba(0, 0, 0, 0.15)`,
          color: 'black',
          border: '2px solid rgba(0, 0, 0, 0.2)'
        };
    }
  };

  const nodeStyle = getNodeStyle(data.nodeType, data.depth);
  const icon = getNodeIcon(data.nodeType);
 
  // Get the full text content
  const fullText = data.originalContent || data.label || '';
  
  // Determine if text should be truncated when collapsed
  const shouldTruncate = fullText.length > 60; // Threshold for truncation
  const truncatedText = shouldTruncate ? fullText.substring(0, 57) + '...' : fullText;
  
  // Display text based on expansion state
  const displayText = isExpanded ? fullText : truncatedText;

  return (
    <div
      style={nodeStyle}
      className="custom-node"
      title={`${fullText} (Depth: ${data.depth || 0}) - Click to ${isExpanded ? 'collapse' : 'expand'}`}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        cursor: 'pointer',
        textAlign: 'center',
        width: '100%',
        height: '100%',
        position: 'relative'
      }}>
        <div style={{
          fontWeight: 'inherit',
          wordBreak: 'break-word',
          lineHeight: isExpanded ? '1.4' : '1.3',
          overflow: 'visible',
          maxWidth: '100%',
          textAlign: 'center'
        }}>
          {displayText}
        </div>
        
        {/* Expansion indicator */}
        {shouldTruncate && (
          <div style={{
            fontSize: '10px',
            opacity: 0.8,
            marginTop: isExpanded ? '8px' : '4px',
            fontStyle: 'italic',
            fontWeight: 'normal',
            color: 'inherit'
          }}>
            {isExpanded ? '▲ Click to collapse' : '▼ Click to expand'}
          </div>
        )}
      </div>
     
      {/* Enhanced depth indicator */}
      {data.depth !== undefined && data.depth > 0 && (
        <div style={{
          position: 'absolute',
          top: '-2px',
          right: '-2px',
          background: 'linear-gradient(135deg, #1a365d 0%, #2d3748 100%)',
          color: 'white',
          borderRadius: '50%',
          width: '22px',
          height: '22px',
          fontSize: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          border: '3px solid white',
          boxShadow: '0 4px 8px rgba(0,0,0,0.4)',
          zIndex: 10
        }}>
          {data.depth}
        </div>
      )}
     
      {/* Connection handles */}
      <Handle
        type="target"
        position={Position.Top}
        style={{
          background: 'black',
          border: '2px solid white',
          width: '10px',
          height: '10px',
          top: '-5px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
          borderRadius: '50%'
        }}
        isConnectable={isConnectable}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        style={{
          background: 'black',
          border: '2px solid white',
          width: '10px',
          height: '10px',
          bottom: '-5px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
          borderRadius: '50%'
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

// Enhanced complex default graph with backend-style positioning
const defaultGraph = {
  nodes: [
    // Root Business Tool
    {
      id: '1',
      position: { x: 0, y: 0 },
      data: {
        label: 'Customer Relationship Management System',
        nodeType: 'businessTool',
        storage: 'default',
        depth: 0,
        width: 200,
        height: 150
      },
      style: { width: 200, height: 150 },
      type: 'custom'
    },
   
    // Level 1 - Main Conditions with backend spacing
    {
      id: '2',
      position: { x: -345, y: 100 },
      data: {
        label: 'Customer Status Check',
        nodeType: 'condition',
        storage: 'default',
        depth: 1,
        width: 200,
        height: 150
      },
      style: { width: 200, height: 150 },
      type: 'custom'
    },
    {
      id: '3',
      position: { x: -115, y: 100 },
      data: {
        label: 'Account Verification',
        nodeType: 'condition',
        storage: 'default',
        depth: 1,
        width: 200,
        height: 150
      },
      style: { width: 200, height: 150 },
      type: 'custom'
    },
    {
      id: '4',
      position: { x: 115, y: 100 },
      data: {
        label: 'Payment Method Valid',
        nodeType: 'condition',
        storage: 'default',
        depth: 1,
        width: 200,
        height: 150
      },
      style: { width: 200, height: 150 },
      type: 'custom'
    },
    {
      id: '5',
      position: { x: 345, y: 100 },
      data: {
        label: 'Service Availability',
        nodeType: 'condition',
        storage: 'default',
        depth: 1,
        width: 200,
        height: 150
      },
      style: { width: 200, height: 150 },
      type: 'custom'
    },
   
    // Level 2 - Events and Policies
    {
      id: '6',
      position: { x: -460, y: 200 },
      data: {
        label: 'New Customer Registration',
        nodeType: 'event',
        storage: 'default',
        depth: 2,
        width: 200,
        height: 150
      },
      style: { width: 200, height: 150 },
      type: 'custom'
    },
    {
      id: '7',
      position: { x: -230, y: 200 },
      data: {
        label: 'Existing Customer Login',
        nodeType: 'event',
        storage: 'default',
        depth: 2,
        width: 200,
        height: 150
      },
      style: { width: 200, height: 150 },
      type: 'custom'
    },
    {
      id: '8',
      position: { x: 0, y: 200 },
      data: {
        label: 'Account Verification Policy',
        nodeType: 'policy',
        storage: 'default',
        depth: 2,
        width: 200,
        height: 150
      },
      style: { width: 200, height: 150 },
      type: 'custom'
    },
    {
      id: '9',
      position: { x: 230, y: 200 },
      data: {
        label: 'KYC Verification Required',
        nodeType: 'event',
        storage: 'default',
        depth: 2,
        width: 200,
        height: 150
      },
      style: { width: 200, height: 150 },
      type: 'custom'
    },
    {
      id: '10',
      position: { x: 460, y: 200 },
      data: {
        label: 'Credit Card Processing',
        nodeType: 'event',
        storage: 'default',
        depth: 2,
        width: 200,
        height: 150
      },
      style: { width: 200, height: 150 },
      type: 'custom'
    }
  ],
  edges: [
    // Level 1 connections
    {
      id: 'e1-2',
      source: '1',
      target: '2',
      type: 'smoothstep',
      style: { stroke: 'black', strokeWidth: 2 },
      markerEnd: { type: 'arrowclosed', color: 'black', width: 20, height: 20 }
    },
    {
      id: 'e1-3',
      source: '1',
      target: '3',
      type: 'smoothstep',
      style: { stroke: 'black', strokeWidth: 2 },
      markerEnd: { type: 'arrowclosed', color: 'black', width: 20, height: 20 }
    },
    {
      id: 'e1-4',
      source: '1',
      target: '4',
      type: 'smoothstep',
      style: { stroke: 'black', strokeWidth: 2 },
      markerEnd: { type: 'arrowclosed', color: 'black', width: 20, height: 20 }
    },
    {
      id: 'e1-5',
      source: '1',
      target: '5',
      type: 'smoothstep',
      style: { stroke: 'black', strokeWidth: 2 },
      markerEnd: { type: 'arrowclosed', color: 'black', width: 20, height: 20 }
    },
   
    // Level 2 connections
    {
      id: 'e2-6',
      source: '2',
      target: '6',
      type: 'smoothstep',
      style: { stroke: 'black', strokeWidth: 2 },
      markerEnd: { type: 'arrowclosed', color: 'black', width: 20, height: 20 }
    },
    {
      id: 'e2-7',
      source: '2',
      target: '7',
      type: 'smoothstep',
      style: { stroke: 'black', strokeWidth: 2 },
      markerEnd: { type: 'arrowclosed', color: 'black', width: 20, height: 20 }
    },
    {
      id: 'e3-8',
      source: '3',
      target: '8',
      type: 'smoothstep',
      style: { stroke: 'black', strokeWidth: 2 },
      markerEnd: { type: 'arrowclosed', color: 'black', width: 20, height: 20 }
    },
    {
      id: 'e4-9',
      source: '4',
      target: '9',
      type: 'smoothstep',
      style: { stroke: 'black', strokeWidth: 2 },
      markerEnd: { type: 'arrowclosed', color: 'black', width: 20, height: 20 }
    },
    {
      id: 'e5-10',
      source: '5',
      target: '10',
      type: 'smoothstep',
      style: { stroke: 'black', strokeWidth: 2 },
      markerEnd: { type: 'arrowclosed', color: 'black', width: 20, height: 20 }
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
      mode: 'cors'
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
      nodeTypes: data.metadata?.nodeTypes,
      layout: data.metadata?.layout
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
 
  // React Flow hooks
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
 
  // Load graph data on mount
  useEffect(() => {
    const loadGraphData = async () => {
      console.log(`🚀 Loading graph data for page: ${currentPage}`);
     
      if (!currentPage) {
        console.log('📭 No page ID in URL, using enhanced default graph');
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
            setGraphType('businessECP');
          } else if (nodeTypes.businessTool > 0 || nodeTypes.events > 0) {
            setGraphType('businessTool');
          } else {
            setGraphType('mixed');
          }
        } else {
          console.log('📦 Server data not available, using enhanced default');
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
 
  // Update React Flow nodes and edges when data changes - RESPECT BACKEND POSITIONING
  useEffect(() => {
    if (graphData) {
      console.log(`🔄 Updating React Flow with data from: ${dataSource}`);
     
      // Get layout configuration from backend if available
      const layoutConfig = graphData.metadata?.layout || {};
      console.log('📐 Backend layout config:', layoutConfig);
     
      // Process nodes - PRESERVE backend positions and dimensions
      let processedNodes = (graphData.nodes || []).map(node => {
        // Preserve backend position and dimensions exactly
        const nodeWithBackendLayout = {
          ...node,
          type: 'custom',
          data: {
            ...node.data,
            storage: dataSource,
            depth: node.data?.depth !== undefined ? node.data.depth : 0,
            // Keep backend dimensions
            width: node.data?.width || node.style?.width || layoutConfig.nodeWidth || 200,
            height: node.data?.height || node.style?.height || layoutConfig.nodeHeight || 150
          },
          // Preserve backend style with dimensions
          style: {
            ...node.style,
            width: node.data?.width || node.style?.width || layoutConfig.nodeWidth || 200,
            height: node.data?.height || node.style?.height || layoutConfig.nodeHeight || 150
          }
        };
        
        // IMPORTANT: If backend provided position, use it exactly - NO LAYOUT OPTIMIZATION
        if (node.position) {
          nodeWithBackendLayout.position = { ...node.position };
        }
        
        return nodeWithBackendLayout;
      });
     
      // ===== ADDED POSITION LOGGING =====
      console.log('🔍 DETAILED NODE POSITION ANALYSIS:');
      console.log('================================');
      
      // Group nodes by depth for analysis
      const nodesByDepth = {};
      processedNodes.forEach(node => {
        const depth = node.data.depth || 0;
        if (!nodesByDepth[depth]) nodesByDepth[depth] = [];
        nodesByDepth[depth].push(node);
      });
      
      // Log each level
      Object.keys(nodesByDepth).sort((a, b) => a - b).forEach(depth => {
        console.log(`📊 LEVEL ${depth}:`);
        nodesByDepth[depth].forEach(node => {
          console.log(`  Node ${node.id} (${node.data.nodeType}): "${node.data.label}" at position (${node.position.x}, ${node.position.y})`);
        });
      });
      
      // Analyze parent-child relationships
      console.log('\n🔗 PARENT-CHILD ANALYSIS:');
      console.log('=========================');
      
      // Get edges to understand relationships
      const edgeMap = {};
      (graphData.edges || []).forEach(edge => {
        if (!edgeMap[edge.source]) edgeMap[edge.source] = [];
        edgeMap[edge.source].push(edge.target);
      });
      
      Object.keys(edgeMap).forEach(parentId => {
        const parent = processedNodes.find(n => n.id === parentId);
        const children = edgeMap[parentId].map(childId => processedNodes.find(n => n.id === childId));
        
        if (parent && children.length > 0) {
          const childPositions = children.map(c => c.position.x);
          const leftmost = Math.min(...childPositions);
          const rightmost = Math.max(...childPositions);
          const expectedCenter = (leftmost + rightmost) / 2;
          const actualParentX = parent.position.x;
          const offset = actualParentX - expectedCenter;
          
          console.log(`📍 Parent ${parentId} (${parent.data.label}):`);
          console.log(`   Position: (${actualParentX}, ${parent.position.y})`);
          console.log(`   Children: ${children.map(c => `${c.id}(${c.position.x})`).join(', ')}`);
          console.log(`   Child span: ${leftmost} to ${rightmost}`);
          console.log(`   Expected center: ${expectedCenter}`);
          console.log(`   Actual position: ${actualParentX}`);
          console.log(`   Offset: ${offset} ${offset === 0 ? '✅ CENTERED' : '❌ OFF-CENTER'}`);
          console.log('');
        }
      });
      
      // DO NOT apply any layout optimization - use backend positions exactly as provided
      console.log(`📊 Using backend positions exactly as provided`);
      console.log(`📊 Setting ${processedNodes.length} nodes and ${(graphData.edges || []).length} edges`);
      console.log(`🛠️ Graph type: ${graphType}`);
     
      setNodes(processedNodes);
      setEdges(graphData.edges || []);
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
    layoutConfig: graphData?.metadata?.layout,
    serverUrl: SERVER_URL
  };

  // Enhanced loading state
  if (loading) {
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
            Supporting Business Tools, ECPs, Events, Conditions, Policies & JSON Code
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
 
  // Enhanced error state
  if (error && !graphData) {
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
  }

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      background: 'white', // White background for entire graph
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
      
      {/* Debug info overlay */}
      {process.env.NODE_ENV === 'development' && (
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          background: 'rgba(0,0,0,0.8)',
          color: 'white',
          padding: '10px',
          borderRadius: '8px',
          fontSize: '12px',
          maxWidth: '300px'
        }}>
          <div>Layout Config: {JSON.stringify(debugInfo.layoutConfig)}</div>
          <div>Nodes: {debugInfo.nodeCount}</div>
          <div>Source: {debugInfo.dataSource}</div>
        </div>
      )}
    </div>
  );
}

export default GraphApp;