import React from 'react';
import { X, Server, Network, Database } from 'lucide-react';
import { Node } from 'reactflow';
import { ComposeService, ComposeNetwork, ComposeVolume } from '../types';
import clsx from 'clsx';

interface NodeDetailsPanelProps {
  node: Node | null;
  onClose: () => void;
  isDark: boolean;
}

export const NodeDetailsPanel: React.FC<NodeDetailsPanelProps> = ({ node, onClose, isDark }) => {
  if (!node) return null;

  const renderServiceDetails = (data: ComposeService & { label: string }) => {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Server size={20} className="text-blue-600 dark:text-blue-400" />
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">{data.label}</h2>
        </div>

        {data.image && (
          <div>
            <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1">Image</h3>
            <p className="font-mono text-sm text-slate-700 dark:text-slate-300">{data.image}</p>
          </div>
        )}

        {data.build && (
          <div>
            <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1">Build</h3>
            <p className="font-mono text-sm text-slate-700 dark:text-slate-300">
              {typeof data.build === 'string' ? data.build : data.build.context}
            </p>
          </div>
        )}

        {data.container_name && (
          <div>
            <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1">Container Name</h3>
            <p className="font-mono text-sm text-slate-700 dark:text-slate-300">{data.container_name}</p>
          </div>
        )}

        {data.ports && data.ports.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1">Ports</h3>
            <div className="flex flex-wrap gap-2">
              {data.ports.map((port, i) => (
                <span
                  key={i}
                  className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded font-mono text-xs"
                >
                  {typeof port === 'object' ? `${port.published}:${port.target}` : port}
                </span>
              ))}
            </div>
          </div>
        )}

        {data.volumes && data.volumes.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1">Volumes</h3>
            <div className="space-y-1">
              {data.volumes.map((vol, i) => (
                <p key={i} className="font-mono text-sm text-slate-700 dark:text-slate-300">
                  {typeof vol === 'string' ? vol : `${vol.source}:${vol.target}`}
                </p>
              ))}
            </div>
          </div>
        )}

        {data.networks && (
          <div>
            <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1">Networks</h3>
            <div className="flex flex-wrap gap-2">
              {(Array.isArray(data.networks) ? data.networks : Object.keys(data.networks)).map((net, i) => (
                <span
                  key={i}
                  className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-2 py-1 rounded text-xs"
                >
                  {net}
                </span>
              ))}
            </div>
          </div>
        )}

        {data.environment && (
          <div>
            <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1">Environment Variables</h3>
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {Array.isArray(data.environment)
                ? data.environment.map((env, i) => (
                    <p key={i} className="font-mono text-xs text-slate-700 dark:text-slate-300">
                      {env}
                    </p>
                  ))
                : Object.entries(data.environment).map(([key, value]) => (
                    <p key={key} className="font-mono text-xs text-slate-700 dark:text-slate-300">
                      {key}={value}
                    </p>
                  ))}
            </div>
          </div>
        )}

        {data.depends_on && (
          <div>
            <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1">Depends On</h3>
            <div className="flex flex-wrap gap-2">
              {(Array.isArray(data.depends_on) ? data.depends_on : Object.keys(data.depends_on)).map((dep, i) => (
                <span
                  key={i}
                  className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded text-xs"
                >
                  {dep}
                </span>
              ))}
            </div>
          </div>
        )}

        {data.command && (
          <div>
            <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1">Command</h3>
            <p className="font-mono text-xs text-slate-700 dark:text-slate-300">
              {Array.isArray(data.command) ? data.command.join(' ') : data.command}
            </p>
          </div>
        )}
      </div>
    );
  };

  const renderNetworkDetails = (data: { label: string; details?: ComposeNetwork; implicit?: boolean }) => {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Network size={20} className="text-slate-600 dark:text-slate-400" />
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">{data.label}</h2>
          {data.implicit && (
            <span className="text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 px-2 py-1 rounded">
              Implicit
            </span>
          )}
        </div>

        {data.details && (
          <>
            {data.details.driver && (
              <div>
                <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1">Driver</h3>
                <p className="text-sm text-slate-700 dark:text-slate-300">{data.details.driver}</p>
              </div>
            )}

            {data.details.external !== undefined && (
              <div>
                <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1">External</h3>
                <p className="text-sm text-slate-700 dark:text-slate-300">{data.details.external ? 'Yes' : 'No'}</p>
              </div>
            )}

            {data.details.name && (
              <div>
                <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1">Name</h3>
                <p className="font-mono text-sm text-slate-700 dark:text-slate-300">{data.details.name}</p>
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  const renderVolumeDetails = (data: { label: string; details?: ComposeVolume; implicit?: boolean }) => {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Database size={20} className="text-amber-600 dark:text-amber-400" />
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">{data.label}</h2>
          {data.implicit && (
            <span className="text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 px-2 py-1 rounded">
              Implicit
            </span>
          )}
        </div>

        {data.details && (
          <>
            {data.details.driver && (
              <div>
                <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1">Driver</h3>
                <p className="text-sm text-slate-700 dark:text-slate-300">{data.details.driver}</p>
              </div>
            )}

            {data.details.external !== undefined && (
              <div>
                <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1">External</h3>
                <p className="text-sm text-slate-700 dark:text-slate-300">{data.details.external ? 'Yes' : 'No'}</p>
              </div>
            )}

            {data.details.name && (
              <div>
                <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1">Name</h3>
                <p className="font-mono text-sm text-slate-700 dark:text-slate-300">{data.details.name}</p>
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  return (
    <div
      className={clsx(
        'absolute right-0 top-0 h-full w-full md:w-96 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-xl z-30 flex flex-col',
        'transition-transform duration-300 ease-in-out'
      )}
    >
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">Node Details</span>
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {node.type === 'service' && renderServiceDetails(node.data as ComposeService & { label: string })}
        {node.type === 'network' && renderNetworkDetails(node.data as { label: string; details?: ComposeNetwork; implicit?: boolean })}
        {node.type === 'volume' && renderVolumeDetails(node.data as { label: string; details?: ComposeVolume; implicit?: boolean })}
      </div>
    </div>
  );
};
