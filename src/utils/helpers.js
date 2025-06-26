import { SERVER_URL } from '../config/constants.js';

// ===== UTILITY FUNCTIONS =====

export const getPageFromUrl = () => {
  const params = new URLSearchParams(window.location.search);
  return params.get('page') || null;
};

export const fetchGraphDataFromServer = async (pageId, graphType = 'technical') => {
  try {
    console.log(`🔍 Fetching ${graphType} graph data from server for page: ${pageId}`);
    
    const endpoint = graphType === 'humanized' 
      ? `${SERVER_URL}/api/graph-data/${pageId}/humanized`
      : `${SERVER_URL}/api/graph-data/${pageId}`;
    
    console.log(`🌐 Server URL: ${endpoint}`);
   
    const response = await fetch(endpoint, {
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
        console.warn(`📄 ${graphType} graph data not found for page: ${pageId}`);
        return null;
      }
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
   
    const data = await response.json();
    console.log(`✅ Successfully fetched ${graphType} graph data:`, {
      success: data.success,
      nodes: data.nodes?.length,
      edges: data.edges?.length,
      pageId: data.pageId,
      storage: data.storage,
      maxDepth: data.metadata?.maxDepth,
      nodeTypes: data.metadata?.nodeTypes,
      layout: data.metadata?.layout,
      hasAITitles: data.hasAITitles,
      aiGeneratedCount: data.aiGeneratedCount,
      humanizedCount: data.humanizedCount
    });
   
    return data;
  } catch (error) {
    console.error(`❌ Failed to fetch ${graphType} graph data:`, error);
    return null;
  }
};