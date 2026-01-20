import React, { useState } from 'react';
import { Download, Camera, FileText } from 'lucide-react';
import { exportAsImage, exportAsPDF } from '../utils/exporter';
import clsx from 'clsx';

interface ExportMenuProps {
  yamlContent: string;
  isDark: boolean;
}

export const ExportMenu: React.FC<ExportMenuProps> = ({ yamlContent, isDark }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleExportImage = async () => {
    try {
      // Small delay to ensure React Flow is fully rendered
      await new Promise(resolve => setTimeout(resolve, 100));
      await exportAsImage('react-flow', 'docker-compose-viz.png');
    } catch (error) {
      console.error('Failed to export image:', error);
      alert('Failed to export image. Please try again.');
    }
    setIsOpen(false);
  };

  const handleExportPDF = async () => {
    try {
      // Small delay to ensure React Flow is fully rendered
      await new Promise(resolve => setTimeout(resolve, 100));
      await exportAsPDF(yamlContent, 'react-flow', 'docker-compose-viz.pdf');
    } catch (error) {
      console.error('Failed to export PDF:', error);
      alert('Failed to export PDF. Please try again.');
    }
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-400"
        title="Export visualization"
      >
        <Download size={20} />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div
            className={clsx(
              "absolute right-0 top-full mt-2 w-56 rounded-lg shadow-lg z-50",
              "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700",
              "py-2"
            )}
          >
            <button
              onClick={handleExportImage}
              className="w-full px-4 py-2 text-left hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300"
              title="Export visualization as PNG image"
            >
              <Camera size={16} />
              Export as PNG
            </button>
            <button
              onClick={handleExportPDF}
              className="w-full px-4 py-2 text-left hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300"
              title="Export visualization and YAML as PDF"
            >
              <FileText size={16} />
              Export as PDF
            </button>
          </div>
        </>
      )}
    </div>
  );
};
