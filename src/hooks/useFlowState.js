import { useEffect } from 'react';
import { useNodesState, useEdgesState } from 'reactflow';

export const useFlowState = (technicalGraphData, humanizedGraphData, dataSource, expandedNodeId) => {
  // React Flow hooks for technical graph
  const [technicalNodes, setTechnicalNodes, onTechnicalNodesChange] = useNodesState([]);
  const [technicalEdges, setTechnicalEdges, onTechnicalEdgesChange] = useEdgesState([]);
  
  // React Flow hooks for humanized graph
  const [humanizedNodes, setHumanizedNodes, onHumanizedNodesChange] = useNodesState([]);
  const [humanizedEdges, setHumanizedEdges, onHumanizedEdgesChange] = useEdgesState([]);

  // Process nodes with backend layout preservation
  const processNodes = (graphData, expandedNodeId = null) => {
    if (!graphData) return [];

    const layoutConfig = graphData.metadata?.layout || {};
    console.log('📐 Backend layout config:', layoutConfig);
   
    return (graphData.nodes || []).map(node => {
      const isExpanded = expandedNodeId === node.id;
      
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
          height: node.data?.height || node.style?.height || layoutConfig.nodeHeight || 150,
          // Ensure AI metadata is preserved
          aiGenerated: node.data?.aiGenerated || false,
          originalToggleTitle: node.data?.originalToggleTitle || node.data?.originalContent,
          extractedContent: node.data?.extractedContent || '',
          cleanedContent: node.data?.cleanedContent || node.data?.label,
          humanizedCondition: node.data?.humanizedCondition || false
        },
        // Preserve backend style with dimensions and dynamic z-index
        style: {
          ...node.style,
          width: node.data?.width || node.style?.width || layoutConfig.nodeWidth || 200,
          height: node.data?.height || node.style?.height || layoutConfig.nodeHeight || 150,
          // CRITICAL: Set z-index at ReactFlow level for expanded nodes
          zIndex: isExpanded ? 99999 : (node.data?.depth || 0) + 1
        },
        // Add z-index to the node level too
        zIndex: isExpanded ? 99999 : (node.data?.depth || 0) + 1
      };
      
      // IMPORTANT: If backend provided position, use it exactly
      if (node.position) {
        nodeWithBackendLayout.position = { ...node.position };
      }
      
      // Log node information based on type
      if (node.data?.aiGenerated) {
        console.log(`🤖 Processing AI Node: ${node.data.nodeType} - Original: "${node.data.originalToggleTitle}" -> AI: "${node.data.cleanedContent || node.data.label}"`);
      }
      
      if (node.data?.humanizedCondition) {
        console.log(`👤 Processing Humanized Node: ${node.data.nodeType} - Original: "${node.data.originalToggleTitle}" -> Humanized: "${node.data.cleanedContent || node.data.label}"`);
      }
      
      return nodeWithBackendLayout;
    });
  };

  // Update React Flow nodes and edges when technical data changes
  useEffect(() => {
    if (technicalGraphData) {
      console.log(`🔄 Updating React Flow with technical data from: ${dataSource}`);
      
      const processedNodes = processNodes(technicalGraphData, expandedNodeId);
      
      console.log(`📊 Setting ${processedNodes.length} technical nodes and ${(technicalGraphData.edges || []).length} edges`);
     
      setTechnicalNodes(processedNodes);
      setTechnicalEdges(technicalGraphData.edges || []);
    }
  }, [technicalGraphData, dataSource, expandedNodeId, setTechnicalNodes, setTechnicalEdges]);

  // Update React Flow nodes and edges when humanized data changes
  useEffect(() => {
    if (humanizedGraphData) {
      console.log(`🔄 Updating React Flow with humanized data`);
      
      const processedNodes = processNodes(humanizedGraphData, expandedNodeId);
      
      console.log(`📊 Setting ${processedNodes.length} humanized nodes and ${(humanizedGraphData.edges || []).length} edges`);
     
      setHumanizedNodes(processedNodes);
      setHumanizedEdges(humanizedGraphData.edges || []);
    }
  }, [humanizedGraphData, expandedNodeId, setHumanizedNodes, setHumanizedEdges]);

  return {
    technicalNodes,
    technicalEdges,
    onTechnicalNodesChange,
    onTechnicalEdgesChange,
    humanizedNodes,
    humanizedEdges,
    onHumanizedNodesChange,
    onHumanizedEdgesChange
  };
};