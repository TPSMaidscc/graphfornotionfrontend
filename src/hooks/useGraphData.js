import { useState, useEffect } from 'react';
import { fetchGraphDataFromServer } from '../utils/helpers.js';
import { defaultGraph } from '../config/constants.js';

export const useGraphData = (currentPage) => {
  const [technicalGraphData, setTechnicalGraphData] = useState(null);
  const [humanizedGraphData, setHumanizedGraphData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dataSource, setDataSource] = useState('unknown');
  const [graphType, setGraphType] = useState('unknown');
  const [humanizedLoading, setHumanizedLoading] = useState(false);

  // Load technical graph data on mount
  useEffect(() => {
    const loadTechnicalGraphData = async () => {
      console.log(`🚀 Loading technical graph data for page: ${currentPage}`);
     
      if (!currentPage) {
        console.log('📭 No page ID in URL, using enhanced default graph');
        setTechnicalGraphData(defaultGraph);
        setDataSource('default');
        setGraphType('businessTool');
        setLoading(false);
        return;
      }
     
      setLoading(true);
      setError(null);
     
      try {
        const serverData = await fetchGraphDataFromServer(currentPage, 'technical');
       
        if (serverData && serverData.success) {
          console.log('✅ Using technical server data');
          setTechnicalGraphData(serverData);
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
          
          // Log AI information for debugging
          if (serverData.hasAITitles) {
            console.log(`🤖 Technical graph has AI-generated titles: ${serverData.aiGeneratedCount} nodes`);
            const aiNodes = serverData.nodes?.filter(node => node.data?.aiGenerated) || [];
            aiNodes.forEach(node => {
              console.log(`  🤖 AI Node: ${node.data.nodeType} - "${node.data.label}" (AI: ${node.data.aiGenerated})`);
            });
          } else {
            console.log(`⚠️ Technical graph has no AI-generated titles`);
          }
        } else {
          console.log('📦 Technical server data not available, using enhanced default');
          setTechnicalGraphData(defaultGraph);
          setDataSource('default-fallback');
          setGraphType('businessTool');
        }
      } catch (err) {
        console.error('❌ Error loading technical graph data:', err);
        setError(err.message);
        setTechnicalGraphData(defaultGraph);
        setDataSource('error-fallback');
        setGraphType('businessTool');
      } finally {
        setLoading(false);
      }
    };
   
    loadTechnicalGraphData();
  }, [currentPage]);

  // Load humanized graph data when needed
  const loadHumanizedGraphData = async () => {
    if (!currentPage || humanizedGraphData) {
      return; // Don't reload if already loaded or no page
    }

    setHumanizedLoading(true);
    
    try {
      console.log(`🤖 Loading humanized graph data for page: ${currentPage}`);
      const serverData = await fetchGraphDataFromServer(currentPage, 'humanized');
      
      if (serverData && serverData.success) {
        console.log('✅ Using humanized server data');
        setHumanizedGraphData(serverData);
        
        // Log humanized information for debugging
        if (serverData.humanizedCount > 0) {
          console.log(`👤 Humanized graph has ${serverData.humanizedCount} humanized conditions`);
          const humanizedNodes = serverData.nodes?.filter(node => node.data?.humanizedCondition) || [];
          humanizedNodes.forEach(node => {
            console.log(`  👤 Humanized Node: ${node.data.nodeType} - "${node.data.label}"`);
          });
        }
      } else {
        console.log('📦 Humanized server data not available');
        setHumanizedGraphData(null);
      }
    } catch (err) {
      console.error('❌ Error loading humanized graph data:', err);
      setHumanizedGraphData(null);
    } finally {
      setHumanizedLoading(false);
    }
  };

  return {
    technicalGraphData,
    humanizedGraphData,
    loading,
    error,
    dataSource,
    graphType,
    humanizedLoading,
    loadHumanizedGraphData
  };
};