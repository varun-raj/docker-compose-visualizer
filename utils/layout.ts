import dagre from 'dagre';
import { Node, Edge, Position } from 'reactflow';

const nodeWidth = 280;
const nodeHeight = 150;
const networkNodeWidth = 150;
const networkNodeHeight = 50;

export const getLayoutedElements = (nodes: Node[], edges: Edge[], direction = 'LR') => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  const isHorizontal = direction === 'LR';
  dagreGraph.setGraph({ rankdir: direction, ranksep: 100, nodesep: 50 });

  nodes.forEach((node) => {
    let width = nodeWidth;
    let height = nodeHeight;

    // Adjust dimensions based on type for tighter layout
    if (node.type === 'network') {
      width = networkNodeWidth;
      height = networkNodeHeight;
    } else if (node.type === 'volume') {
      width = 150;
      height = 50;
    }

    dagreGraph.setNode(node.id, { width, height });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    
    // We are shifting the dagre node position (anchor=center center) to the top left
    // so it matches React Flow's anchor point
    let width = nodeWidth;
    let height = nodeHeight;
    
    if (node.type === 'network') {
        width = networkNodeWidth;
        height = networkNodeHeight;
      } else if (node.type === 'volume') {
        width = 150;
        height = 50;
      }

    return {
      ...node,
      targetPosition: isHorizontal ? Position.Left : Position.Top,
      sourcePosition: isHorizontal ? Position.Right : Position.Bottom,
      position: {
        x: nodeWithPosition.x - width / 2,
        y: nodeWithPosition.y - height / 2,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
};