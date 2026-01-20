import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Network } from 'lucide-react';

export const NetworkNode: React.FC<NodeProps> = ({ data }) => {
  return (
    <div className="min-w-[120px] px-4 py-2 bg-slate-50 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-full flex items-center justify-center gap-2 shadow-sm">
      <Handle type="target" position={Position.Top} className="!opacity-0" />
      <Handle type="source" position={Position.Bottom} className="!opacity-0" />
      <Handle type="target" position={Position.Left} className="!opacity-0" />
      <Handle type="source" position={Position.Right} className="!opacity-0" />
      
      <Network size={16} className="text-slate-500 dark:text-slate-400" />
      <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">{data.label}</span>
    </div>
  );
};