// ===== CONFIGURATION =====
export const SERVER_URL = 'https://backendfornotiongraph.vercel.app'; // Your Vercel backend

// Enhanced complex default graph with backend-style positioning
export const defaultGraph = {
  nodes: [
    // Root Business Tool
    {
      id: '1',
      position: { x: 0, y: 0 },
      data: {
        label: 'Graph has expired. Delete this and press on Create a Graph again!',
        nodeType: 'businessTool',
        storage: 'default',
        depth: 0,
        width: 200,
        height: 150
      },
      style: { width: 200, height: 150 },
      type: 'custom'
    },
  ],
  edges: []
};

// Node types configuration
export const NODE_TYPES_CONFIG = {
  custom: 'CustomNode',
  default: 'CustomNode',
};