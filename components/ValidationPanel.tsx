import React, { useMemo } from 'react';
import { AlertCircle, CheckCircle, Info, AlertTriangle, X, Shield, Network, GitBranch } from 'lucide-react';
import { ValidationResult } from '../utils/validator';
import clsx from 'clsx';

interface ValidationPanelProps {
  validationResult: ValidationResult | null;
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
}

export const ValidationPanel: React.FC<ValidationPanelProps> = ({
  validationResult,
  isOpen,
  onClose,
  isDark,
}) => {
  if (!isOpen || !validationResult) return null;

  const hasIssues = validationResult.issues.length > 0;
  const hasPortConflicts = validationResult.portConflicts.length > 0;
  const hasCycles = validationResult.cycles.length > 0;
  const hasSecurityWarnings = validationResult.securityWarnings.length > 0;
  const hasAnyProblems = hasIssues || hasPortConflicts || hasCycles || hasSecurityWarnings;

  return (
    <div
      className={clsx(
        'absolute bottom-4 left-4 right-4 md:right-auto md:w-96 max-h-[60vh] overflow-hidden',
        'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-xl z-30',
        'flex flex-col transition-all duration-300',
        isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      )}
    >
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {validationResult.isValid && !hasAnyProblems ? (
            <CheckCircle size={20} className="text-green-500" />
          ) : (
            <AlertCircle size={20} className="text-red-500" />
          )}
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Validation Results
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400"
        >
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {validationResult.isValid && !hasAnyProblems && (
          <div className="flex items-center gap-2 text-green-600 dark:text-green-400 text-sm">
            <CheckCircle size={16} />
            <span>All checks passed!</span>
          </div>
        )}

        {hasIssues && (
          <div>
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
              <AlertCircle size={16} className="text-red-500" />
              Issues ({validationResult.issues.length})
            </h3>
            <div className="space-y-2">
              {validationResult.issues.map((issue, i) => (
                <div
                  key={i}
                  className={clsx(
                    'p-2 rounded text-xs',
                    issue.type === 'error'
                      ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300'
                      : issue.type === 'warning'
                      ? 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-300'
                      : 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300'
                  )}
                >
                  {issue.service && <span className="font-semibold">{issue.service}: </span>}
                  {issue.message}
                  {issue.line && <span className="text-slate-500 ml-1">(Line {issue.line})</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {hasPortConflicts && (
          <div>
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
              <Network size={16} className="text-orange-500" />
              Port Conflicts ({validationResult.portConflicts.length})
            </h3>
            <div className="space-y-2">
              {validationResult.portConflicts.map((conflict, i) => (
                <div
                  key={i}
                  className="p-2 rounded bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-300 text-xs"
                >
                  <span className="font-semibold">Port {conflict.port}</span> is used by:{' '}
                  {conflict.services.join(', ')}
                </div>
              ))}
            </div>
          </div>
        )}

        {hasCycles && (
          <div>
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
              <GitBranch size={16} className="text-purple-500" />
              Dependency Cycles ({validationResult.cycles.length})
            </h3>
            <div className="space-y-2">
              {validationResult.cycles.map((cycle, i) => (
                <div
                  key={i}
                  className="p-2 rounded bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 text-xs"
                >
                  <span className="font-semibold">Cycle detected:</span>{' '}
                  {cycle.join(' → ')} → {cycle[0]}
                </div>
              ))}
            </div>
          </div>
        )}

        {hasSecurityWarnings && (
          <div>
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
              <Shield size={16} className="text-amber-500" />
              Security Warnings ({validationResult.securityWarnings.length})
            </h3>
            <div className="space-y-2">
              {validationResult.securityWarnings.map((warning, i) => (
                <div
                  key={i}
                  className={clsx(
                    'p-2 rounded text-xs',
                    warning.type === 'warning'
                      ? 'bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300'
                      : 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300'
                  )}
                >
                  {warning.service && <span className="font-semibold">{warning.service}: </span>}
                  {warning.message}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
