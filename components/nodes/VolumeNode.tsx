import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Database } from 'lucide-react';

export const VolumeNode: React.FC<NodeProps> = ({ data }) => {
  return (
    <div className="min-w-[120px] px-4 py-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-lg flex items-center justify-center gap-2 shadow-sm">
       <Handle type="target" position={Position.Top} className="!bg-amber-400 !w-2 !h-2" />
       <Handle type="source" position={Position.Bottom} className="!bg-amber-400 !w-2 !h-2" />
       <Handle type="target" position={Position.Left} className="!bg-amber-400 !w-2 !h-2" />
      <Handle type="source" position={Position.Right} className="!bg-amber-400 !w-2 !h-2" />

      <Database size={16} className="text-amber-600 dark:text-amber-500" />
      <span className="text-sm font-medium text-amber-800 dark:text-amber-200">{data.label}</span>
    </div>
  );
};