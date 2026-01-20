import React, { useCallback, useMemo, useState } from 'react';
import ReactFlow, {
  Controls,
  Background,
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  ConnectionMode,
  MiniMap,
  Panel,
  ReactFlowProvider,
  NodeMouseHandler,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { ServiceNode } from './nodes/ServiceNode';
import { NetworkNode } from './nodes/NetworkNode';
import { VolumeNode } from './nodes/VolumeNode';

interface VisualizerProps {
  nodes: Node[];
  edges: Edge[];
  isDark: boolean;
  onNodeClick?: (node: Node) => void;
  searchQuery?: string;
  filters?: {
    services: boolean;
    networks: boolean;
    volumes: boolean;
  };
  selectedNodeId?: string | null;
  hoveredNodeId?: string | null;
  onNodeHover?: (nodeId: string | null) => void;
  portConflicts?: string[];
  cycleServices?: string[];
}

const nodeTypes = {
  service: ServiceNode,
  network: NetworkNode,
  volume: VolumeNode,
};

const Flow: React.FC<VisualizerProps> = ({
  nodes: initialNodes,
  edges: initialEdges,
  isDark,
  onNodeClick,
  searchQuery = '',
  filters = { services: true, networks: true, volumes: true },
  selectedNodeId,
  hoveredNodeId,
  onNodeHover,
  portConflicts = [],
  cycleServices = [],
}) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Update nodes and edges when props change
  React.useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  // Filter and highlight nodes based on search and filters
  const filteredNodes = useMemo(() => {
    return nodes.map((node) => {
      const label = node.data?.label || '';
      const matchesSearch = !searchQuery || label.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Check type filter
      let visible = true;
      if (node.type === 'service' && !filters.services) visible = false;
      if (node.type === 'network' && !filters.networks) visible = false;
      if (node.type === 'volume' && !filters.volumes) visible = false;

      // Get connected node IDs for highlighting
      const connectedNodeIds = new Set<string>();
      edges.forEach((edge) => {
        if (edge.source === node.id) connectedNodeIds.add(edge.target);
        if (edge.target === node.id) connectedNodeIds.add(edge.source);
      });

      const isHighlighted = hoveredNodeId === node.id || connectedNodeIds.has(hoveredNodeId || '');
      const isSelected = selectedNodeId === node.id;
      const hasPortConflict = portConflicts.includes(node.id);
      const isInCycle = cycleServices.includes(node.id);

      let borderColor = node.style?.border;
      if (isSelected) {
        borderColor = '3px solid #3b82f6';
      } else if (isHighlighted) {
        borderColor = '2px solid #60a5fa';
      } else if (hasPortConflict) {
        borderColor = '2px solid #f59e0b';
      } else if (isInCycle) {
        borderColor = '2px solid #ef4444';
      }

      return {
        ...node,
        hidden: !matchesSearch || !visible,
        style: {
          ...node.style,
          opacity: !matchesSearch || !visible ? 0.3 : isHighlighted ? 1 : isSelected ? 1 : 0.8,
          border: borderColor,
        },
      };
    });
  }, [nodes, edges, searchQuery, filters, hoveredNodeId, selectedNodeId]);

  // Highlight edges connected to hovered node
  const highlightedEdges = useMemo(() => {
    if (!hoveredNodeId) return edges;
    
    return edges.map((edge) => {
      const isConnected = edge.source === hoveredNodeId || edge.target === hoveredNodeId;
      return {
        ...edge,
        style: {
          ...edge.style,
          opacity: isConnected ? 1 : 0.2,
          strokeWidth: isConnected ? 3 : 1,
        },
      };
    });
  }, [edges, hoveredNodeId]);

  const handleNodeClick: NodeMouseHandler = useCallback(
    (event, node) => {
      onNodeClick?.(node);
    },
    [onNodeClick]
  );

  const handleNodeMouseEnter: NodeMouseHandler = useCallback(
    (event, node) => {
      onNodeHover?.(node.id);
    },
    [onNodeHover]
  );

  const handleNodeMouseLeave: NodeMouseHandler = useCallback(() => {
    onNodeHover?.(null);
  }, [onNodeHover]);

  return (
    <div 
      className="w-full h-full bg-slate-50 dark:bg-slate-950"
      style={{
        backgroundImage: isDark 
          ? 'radial-gradient(circle, #475569 1px, transparent 1px)'
          : 'radial-gradient(circle, #cbd5e1 1px, transparent 1px)',
        backgroundSize: '20px 20px',
      }}
    >
      <ReactFlow
        nodes={filteredNodes}
        edges={highlightedEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        connectionMode={ConnectionMode.Loose}
        onNodeClick={handleNodeClick}
        onNodeMouseEnter={handleNodeMouseEnter}
        onNodeMouseLeave={handleNodeMouseLeave}
        fitView
        minZoom={0.1}
        maxZoom={2}
        className="transition-colors duration-300"
      >
        <Background 
          variant="dots" 
          gap={20} 
          size={1}
          color={isDark ? '#475569' : '#94a3b8'}
          style={{ backgroundColor: isDark ? '#020617' : '#f8fafc' }}
        />
        <Controls 
            className="!bg-white dark:!bg-slate-800 !border-slate-200 dark:!border-slate-700 !shadow-lg [&>button]:!border-slate-200 dark:[&>button]:!border-slate-700 [&>button]:!text-slate-600 dark:[&>button]:!text-slate-300"
        />
        <MiniMap 
            className="!bg-white dark:!bg-slate-800 !border-slate-200 dark:!border-slate-700 !shadow-lg rounded-lg overflow-hidden"
            nodeColor={(node) => {
                if(node.type === 'service') return '#3b82f6';
                if(node.type === 'network') return '#64748b';
                if(node.type === 'volume') return '#f59e0b';
                return '#eee';
            }}
            maskColor={isDark ? 'rgba(30, 41, 59, 0.7)' : 'rgba(241, 245, 249, 0.7)'}
        />
        <Panel position="bottom-center" className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm mb-8 text-xs text-slate-500 dark:text-slate-400">
            {nodes.filter(n => n.type === 'service').length} Services • {nodes.filter(n => n.type === 'network').length} Networks • {nodes.filter(n => n.type === 'volume').length} Volumes
        </Panel>
      </ReactFlow>
    </div>
  );
};

export const Visualizer = (props: VisualizerProps) => {
    return (
        <ReactFlowProvider>
            <Flow {...props} />
        </ReactFlowProvider>
    )
}
