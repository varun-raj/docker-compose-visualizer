import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Globe, Server, Layers } from 'lucide-react';
import { ComposeService } from '../../types';
import { getServiceIcon } from '../../utils/serviceIcons';

export const ServiceNode: React.FC<NodeProps<ComposeService & { label: string }>> = ({ data }) => {
  const ServiceIcon = getServiceIcon(data.label);
  
  return (
    <div className="bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-lg shadow-xl w-[280px] overflow-hidden transition-all hover:border-blue-500 dark:hover:border-blue-400">
      {/* Handles */}
      <Handle type="target" position={Position.Top} className="!bg-slate-400 !w-3 !h-3" />
      <Handle type="source" position={Position.Bottom} className="!bg-blue-500 !w-3 !h-3" />
      <Handle type="target" position={Position.Left} id="l" className="!bg-slate-400 !w-2 !h-2 !top-[30%]" />
      <Handle type="source" position={Position.Right} id="r" className="!bg-blue-500 !w-2 !h-2 !top-[30%]" />

      {/* Header */}
      <div className="bg-slate-100 dark:bg-slate-900 p-3 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-100 dark:bg-blue-900 rounded-md">
                <ServiceIcon size={16} className="text-blue-600 dark:text-blue-300" />
            </div>
            <span className="font-bold text-slate-800 dark:text-slate-100 truncate max-w-[150px]" title={data.label}>
            {data.label}
            </span>
        </div>
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" title="Active"></div>
      </div>

      {/* Body */}
      <div className="p-3 space-y-3">
        {/* Image */}
        <div className="flex items-start gap-2 text-xs">
            <Layers size={14} className="mt-0.5 text-slate-400" />
            <div className="flex flex-col">
                <span className="text-slate-500 dark:text-slate-400 uppercase text-[10px] font-semibold tracking-wider">Image</span>
                <span className="font-mono text-slate-700 dark:text-slate-200 break-all leading-tight">
                    {data.image || 'build: local'}
                </span>
            </div>
        </div>

        {/* Ports */}
        {data.ports && data.ports.length > 0 && (
            <div className="flex items-start gap-2 text-xs">
                <Globe size={14} className="mt-0.5 text-slate-400" />
                <div className="flex flex-col">
                     <span className="text-slate-500 dark:text-slate-400 uppercase text-[10px] font-semibold tracking-wider">Ports</span>
                     <div className="flex flex-wrap gap-1 mt-0.5">
                        {data.ports.map((p, i) => (
                            <span key={i} className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-1.5 py-0.5 rounded font-mono">
                                {typeof p === 'object' ? `${p.published}:${p.target}` : p}
                            </span>
                        ))}
                     </div>
                </div>
            </div>
        )}

        {/* Environment (Summary) */}
        {data.environment && (
            <div className="flex items-start gap-2 text-xs">
                <Server size={14} className="mt-0.5 text-slate-400" />
                <div className="flex flex-col w-full">
                     <span className="text-slate-500 dark:text-slate-400 uppercase text-[10px] font-semibold tracking-wider">Env Vars</span>
                     <span className="text-slate-600 dark:text-slate-300">
                        {Array.isArray(data.environment) ? data.environment.length : Object.keys(data.environment).length} defined
                     </span>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};