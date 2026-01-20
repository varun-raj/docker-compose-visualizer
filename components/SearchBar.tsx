import React from 'react';
import { Search, X, Filter } from 'lucide-react';
import clsx from 'clsx';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filters: {
    services: boolean;
    networks: boolean;
    volumes: boolean;
  };
  onFilterChange: (type: 'services' | 'networks' | 'volumes', value: boolean) => void;
  isDark: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  onSearchChange,
  filters,
  onFilterChange,
  isDark,
}) => {
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search nodes..."
            className={clsx(
              'w-full pl-10 pr-8 py-2 rounded-lg text-sm',
              'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700',
              'text-slate-700 dark:text-slate-300 placeholder-slate-400',
              'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            )}
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={clsx(
              'p-2 rounded-lg transition-colors',
              isFilterOpen
                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            )}
            title="Filter nodes"
          >
            <Filter size={18} />
          </button>

          {isFilterOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsFilterOpen(false)}
              />
              <div
                className={clsx(
                  'absolute right-0 top-full mt-2 w-48 rounded-lg shadow-lg z-50',
                  'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700',
                  'py-2'
                )}
              >
                <label className="flex items-center gap-2 px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.services}
                    onChange={(e) => onFilterChange('services', e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-slate-700 dark:text-slate-300">Services</span>
                </label>
                <label className="flex items-center gap-2 px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.networks}
                    onChange={(e) => onFilterChange('networks', e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-slate-700 dark:text-slate-300">Networks</span>
                </label>
                <label className="flex items-center gap-2 px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.volumes}
                    onChange={(e) => onFilterChange('volumes', e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-slate-700 dark:text-slate-300">Volumes</span>
                </label>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
