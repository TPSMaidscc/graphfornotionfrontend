import React, { useRef } from 'react';
import { Handle, Position } from 'reactflow';
import { useNodeExpansion } from './NodeExpansionContext.js';

// Enhanced Custom node component with dynamic expansion
const CustomNode = ({ data, isConnectable, id }) => {
  const nodeRef = useRef(null);
  const { expandedNodeId, expandNode, collapseNode, isNodeExpanded } = useNodeExpansion();
  
  // Check if this node is expanded
  const isExpanded = isNodeExpanded(id);
 
  const getNodeIcon = (nodeType) => {
    return '';
  };

  // Improved function to calculate dynamic dimensions based on text
  const calculateDynamicSize = (text, isExpanded, baseWidth = 200, baseHeight = 100) => {
    // IMPORTANT: Keep the actual node size consistent for ReactFlow
    // Only change the visual content area, not the node dimensions
    return { width: baseWidth, height: baseHeight };
  };

  const getNodeStyle = (nodeType, depth = 0) => {
    // Keep consistent base dimensions for ReactFlow handles
    const baseWidth = 200;
    const baseHeight = 100;
    
    // Enhanced base styles with consistent dimensions
    const baseStyle = {
      border: 'none',
      borderRadius: '16px',
      fontWeight: '600',
      textAlign: 'center',
      position: 'relative',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      cursor: 'pointer',
      wordWrap: 'break-word',
      whiteSpace: 'normal',
      lineHeight: '1.4',
      transition: 'all 0.05s ',
      backdropFilter: 'blur(8px)',
      // Keep consistent dimensions for ReactFlow - expansion happens in inner div
      width: `${baseWidth}px`,
      height: `${baseHeight}px`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '10px',
      transformOrigin: 'center center',
      // CRITICAL FIX: Much higher z-index when expanded to appear above all other nodes
      // Also add transform to force a new stacking context
      zIndex: isExpanded ? 99999 : depth + 1,
      transform: isExpanded ? 'translateZ(0) scale(1.001)' : 'translateZ(0)',
      overflow: 'visible' // Allow inner content to expand beyond boundaries
    };

    // Enhanced depth scaling
    const depthScale = Math.max(0.75, 1 - (depth * 0.04));
    const shadowIntensity = Math.max(0.2, 0.5 - (depth * 0.05));
   
    switch (nodeType) {
      case 'businessTool':
        return {
          ...baseStyle,
          background: '#27a567',
          fontSize: `${Math.max(12, isExpanded ? 14 : 17 * depthScale)}px`,
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
          fontSize: `${Math.max(12, isExpanded ? 14 : 17 * depthScale)}px`,
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
          fontSize: `${Math.max(12, isExpanded ? 13 : 15 * depthScale)}px`,
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
          fontSize: `${Math.max(12, isExpanded ? 13 : 15 * depthScale)}px`,
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
          fontSize: `${Math.max(12, isExpanded ? 13 : 15 * depthScale)}px`,
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
          fontSize: `${Math.max(12, isExpanded ? 13 : 15 * depthScale)}px`,
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
          fontSize: `${Math.max(12, isExpanded ? 13 : 14 * depthScale)}px`,
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
 
  // Get the display title for different graph types
  const getDisplayTitle = () => {
    // For policies and events, check if we have an AI-generated title
    if ((data.nodeType === 'policy' || data.nodeType === 'event') && data.aiGenerated) {
      // Use the AI-generated label (cleanedContent or label)
      return data.cleanedContent || data.label;
    }
    
    // For conditions that are humanized, use the humanized version
    if (data.nodeType === 'condition' && data.humanizedCondition && data.aiGenerated) {
      return data.cleanedContent || data.label;
    }
    
    // For all other nodes or non-AI nodes, use the label
    return data.label || data.originalContent || '';
  };
  
  // Get the expanded content - show AI title for AI nodes, original for others
  const getExpandedContent = () => {
    // For AI-generated nodes, show the AI title when expanded (not the original toggle title)
    if (data.aiGenerated && (data.nodeType === 'policy' || data.nodeType === 'event' || data.humanizedCondition)) {
      return data.cleanedContent || data.label;
    }
    
    // For non-AI nodes, show the original content when expanded
    return data.originalContent || data.label || '';
  };
  
  // Get the full text content for expansion and tooltips
  const fullText = data.originalContent || data.label || '';
  const displayTitle = getDisplayTitle();
  const expandedContent = getExpandedContent();
  
  // Determine if text should be truncated when collapsed
  const shouldTruncate = displayTitle.length > 50; // Reduced threshold for better UX
  const truncatedText = shouldTruncate ? displayTitle.substring(0, 47) + '...' : displayTitle;
  
  // Display text based on expansion state - use proper content for expansion
  const displayText = isExpanded ? expandedContent : truncatedText;

  // Create tooltip with debugging info
  const createTooltip = () => {
    let tooltip = `${fullText} (Depth: ${data.depth || 0}) - Click to ${isExpanded ? 'collapse' : 'expand'}`;
    
    // Add AI info to tooltip for debugging
    if (data.aiGenerated) {
      tooltip += `\n🤖 AI-Generated: ${data.aiGenerated}`;
      tooltip += `\nOriginal: ${data.originalToggleTitle || data.originalContent}`;
      tooltip += `\nAI Title: ${data.cleanedContent || data.label}`;
      
      if (data.humanizedCondition) {
        tooltip += `\n👤 Humanized Condition`;
      }
    }
    
    return tooltip;
  };

  // Handle node click
  const handleNodeClick = (e) => {
    e.stopPropagation(); // Prevent event bubbling to ReactFlow
    
    if (isExpanded) {
      collapseNode();
    } else {
      expandNode(id);
    }
  };

  return (
    <div
      ref={nodeRef}
      style={{
        ...nodeStyle,
        // Force highest z-index at the div level too
        zIndex: isExpanded ? 99999 : nodeStyle.zIndex,
        position: 'relative',
        // Keep consistent dimensions for ReactFlow handles
        width: '200px',
        height: '100px'
      }}
      className="custom-node"
      title={createTooltip()}
      onClick={handleNodeClick}
    >
      {/* Inner content container that can expand beyond node boundaries */}
      <div style={{
        position: isExpanded ? 'absolute' : 'relative',
        top: isExpanded ? '50%' : '0',
        left: isExpanded ? '50%' : '0',
        transform: isExpanded ? 'translate(-50%, -50%)' : 'none',
        width: isExpanded ? 'auto' : '100%',
        height: isExpanded ? 'auto' : '100%',
        minWidth: isExpanded ? '300px' : '100%',
        maxWidth: isExpanded ? '400px' : '100%',
        minHeight: isExpanded ? '120px' : '100%',
        maxHeight: isExpanded ? '300px' : '100%',
        background: nodeStyle.background,
        border: nodeStyle.border,
        borderRadius: nodeStyle.borderRadius,
        boxShadow: nodeStyle.boxShadow,
        padding: isExpanded ? '16px' : nodeStyle.padding,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        cursor: 'pointer',
        textAlign: 'center',
        backdropFilter: nodeStyle.backdropFilter,
        transition: 'all 0.05s ',
        zIndex: isExpanded ? 99999 : 1
      }}>
        <div style={{
          fontWeight: nodeStyle.fontWeight,
          fontSize: nodeStyle.fontSize,
          color: nodeStyle.color,
          wordBreak: 'break-word',
          lineHeight: isExpanded ? '1.3' : '1.2',
          overflow: 'visible',
          maxWidth: '100%',
          textAlign: 'center',
          hyphens: 'auto'
        }}>
          {displayText}
        </div>
        
        {/* AI indicator for humanized conditions */}
        {data.humanizedCondition && (
          <div style={{
            fontSize: '10px',
            opacity: 0.9,
            marginTop: '2px',
            fontStyle: 'italic',
            fontWeight: 'normal',
            color: 'inherit'
          }}>
            👤 Humanized
          </div>
        )}
        
        {/* Expansion indicator */}
        {shouldTruncate && (
          <div style={{
            fontSize: '9px',
            opacity: 0.7,
            marginTop: isExpanded ? '6px' : '3px',
            fontStyle: 'italic',
            fontWeight: 'normal',
            color: 'inherit'
          }}>
            {isExpanded ? '▲ Click to collapse or click outside' : '▼ Click to expand'}
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
     
      {/* Connection handles - Fixed positions regardless of expansion */}
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

export default CustomNode;