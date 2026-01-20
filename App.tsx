import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Visualizer } from './components/Visualizer';
import { parseDockerCompose } from './utils/parser';
import { getLayoutedElements } from './utils/layout';
import { DEFAULT_YAML } from './constants';
import { Node, Edge } from 'reactflow';
import { ExportMenu } from './components/ExportMenu';
import { NodeDetailsPanel } from './components/NodeDetailsPanel';
import { SearchBar } from './components/SearchBar';
import { MonacoEditor } from './components/MonacoEditor';
import { ValidationPanel } from './components/ValidationPanel';
import { getYamlFromUrl, setYamlInUrl } from './utils/urlEncoder';
import { validateDockerCompose, ValidationResult } from './utils/validator';
import { 
    LayoutTemplate, 
    Moon, 
    Sun, 
    Code2, 
    PanelLeftClose, 
    PanelLeftOpen, 
    Play,
    Share2,
    Github,
    Upload,
    Download,
    Sparkles,
    AlertCircle
} from 'lucide-react';
import clsx from 'clsx';

function App() {
  const [yamlContent, setYamlContent] = useState(DEFAULT_YAML);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [isDark, setIsDark] = useState(true);
  const [isEditorOpen, setIsEditorOpen] = useState(true);
  const [direction, setDirection] = useState<'LR' | 'TB'>('LR');
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    services: true,
    networks: true,
    volumes: true,
  });
  const [validationIssues, setValidationIssues] = useState<any[]>([]);
  const monacoEditorRef = useRef<any>(null);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [isValidationPanelOpen, setIsValidationPanelOpen] = useState(false);

  useEffect(() => {
    // Check for YAML in URL
    const urlYaml = getYamlFromUrl();
    if (urlYaml) {
      setYamlContent(urlYaml);
    }
    
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDark(true);
    } else {
      setIsDark(false);
    }
  }, []);

  useEffect(() => {
    // Initial parse
    handleParse();
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const handleParse = useCallback(() => {
    try {
        setError(null);
        const { nodes: parsedNodes, edges: parsedEdges } = parseDockerCompose(yamlContent);
        if (parsedNodes.length === 0) {
            // Non-critical warning, maybe empty
        }
        
        const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
            parsedNodes,
            parsedEdges,
            direction
        );
        
        setNodes(layoutedNodes);
        setEdges(layoutedEdges);

        // Run validation
        const result = validateDockerCompose(yamlContent);
        setValidationResult(result);
    } catch (e) {
        setError("Failed to parse YAML. Please check syntax.");
        console.error(e);
    }
  }, [yamlContent, direction]);

  // Debounced auto-parse effect could go here, but button is safer for heavy layout calcs
  useEffect(() => {
      const timer = setTimeout(() => {
          handleParse();
          // Update URL when YAML changes
          setYamlInUrl(yamlContent);
          
          // Run validation on YAML changes
          try {
              const result = validateDockerCompose(yamlContent);
              setValidationResult(result);
          } catch (e) {
              // Validation errors are handled in the validator
          }
      }, 1000);
      return () => clearTimeout(timer);
  }, [yamlContent, direction, handleParse]);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        setYamlContent(content);
        setError(null);
      }
    };
    reader.onerror = () => {
      setError('Failed to read file');
    };
    reader.readAsText(file);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const handleFileDownload = useCallback(() => {
    const blob = new Blob([yamlContent], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'docker-compose.yml';
    link.click();
    URL.revokeObjectURL(url);
  }, [yamlContent]);


  return (
    <div className="flex h-screen flex-col bg-background text-foreground overflow-hidden">
      
      {/* Navbar */}
      <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between px-4 z-10 relative shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <LayoutTemplate className="text-white w-5 h-5" />
          </div>
          <h1 className="font-bold text-lg hidden sm:block">Docker Compose Viz</h1>
        </div>

        <div className="flex items-center gap-2">
            <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1 mr-2 border border-slate-200 dark:border-slate-700">
                <button 
                    onClick={() => setDirection('LR')}
                    className={clsx(
                        "px-3 py-1 text-xs font-medium rounded-md transition-all",
                        direction === 'LR' 
                            ? "bg-white dark:bg-slate-600 text-blue-600 dark:text-blue-200 shadow-sm" 
                            : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                    )}
                    title="Horizontal layout"
                >
                    Horizontal
                </button>
                <button 
                    onClick={() => setDirection('TB')}
                    className={clsx(
                        "px-3 py-1 text-xs font-medium rounded-md transition-all",
                        direction === 'TB' 
                             ? "bg-white dark:bg-slate-600 text-blue-600 dark:text-blue-200 shadow-sm" 
                            : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                    )}
                    title="Vertical layout"
                >
                    Vertical
                </button>
            </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".yml,.yaml"
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-400 cursor-pointer"
            title="Upload docker-compose.yml"
          >
            <Upload size={20} />
          </label>

          <button
            onClick={handleFileDownload}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-400"
            title="Download docker-compose.yml"
          >
            <Download size={20} />
          </button>

          <ExportMenu yamlContent={yamlContent} isDark={isDark} />

          <button
            onClick={() => setIsValidationPanelOpen(!isValidationPanelOpen)}
            className={clsx(
              "p-2 rounded-lg transition-colors relative",
              validationResult && !validationResult.isValid
                ? "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            )}
            title="View validation results and analysis"
          >
            <AlertCircle size={20} />
            {validationResult && !validationResult.isValid && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            )}
          </button>

          <button
            onClick={() => setIsEditorOpen(!isEditorOpen)}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-400"
            title={isEditorOpen ? "Close editor panel" : "Open editor panel"}
          >
            {isEditorOpen ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
          </button>

          <button
            onClick={() => setIsDark(!isDark)}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-400"
            title={isDark ? "Switch to light theme" : "Switch to dark theme"}
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <a 
            href="#"
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-400 hidden sm:block"
            title="View on GitHub"
          >
            <Github size={20} />
          </a>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Editor Pane */}
        <div 
            className={clsx(
                "bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 flex flex-col z-20 shadow-xl absolute h-full md:relative",
                isEditorOpen ? "w-full md:w-[450px] translate-x-0" : "w-0 -translate-x-full md:translate-x-0 md:w-0 opacity-0 md:opacity-100 border-none"
            )}
        >
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <span className="text-sm font-semibold text-slate-500 flex items-center gap-2">
                    <Code2 size={16} /> docker-compose.yml
                </span>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => {
                            if (monacoEditorRef.current) {
                                monacoEditorRef.current.getAction('editor.action.formatDocument')?.run();
                            }
                        }}
                        className="flex items-center gap-1 text-xs bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-md transition-colors"
                        title="Format YAML"
                    >
                        <Sparkles size={12} /> Format
                    </button>
                    <button 
                        onClick={handleParse}
                        className="flex items-center gap-1 text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md transition-colors"
                    >
                        <Play size={12} fill="currentColor" /> Refresh
                    </button>
                </div>
            </div>
            
            <div className="flex-1 relative">
                <MonacoEditor
                    value={yamlContent}
                    onChange={setYamlContent}
                    isDark={isDark}
                    editorRef={monacoEditorRef}
                    onValidationChange={(markers) => {
                        setValidationIssues(markers);
                        if (markers.length > 0) {
                            const firstError = markers.find(m => m.severity === 8); // Error severity
                            if (firstError) {
                                setError(`Line ${firstError.startLineNumber}: ${firstError.message}`);
                            }
                        } else {
                            setError(null);
                        }
                    }}
                />
                {error && (
                     <div className="absolute bottom-4 left-4 right-4 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs p-3 rounded-md backdrop-blur-sm z-10">
                        {error}
                     </div>
                )}
            </div>
        </div>

        {/* Visualizer Pane */}
        <div className="flex-1 h-full relative bg-slate-50 dark:bg-slate-950">
            {/* Search Bar */}
            <div className="absolute top-4 left-4 right-4 z-20 max-w-md">
                <SearchBar
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    filters={filters}
                    onFilterChange={(type, value) => setFilters({ ...filters, [type]: value })}
                    isDark={isDark}
                />
            </div>

            {/* Unique key forces re-render of flow when nodes change significantly, fixing some layout glitches */}
            <Visualizer 
                key={`${nodes.length}-${direction}-${isDark}`} 
                nodes={nodes} 
                edges={edges} 
                isDark={isDark}
                onNodeClick={setSelectedNode}
                searchQuery={searchQuery}
                filters={filters}
                selectedNodeId={selectedNode?.id}
                hoveredNodeId={hoveredNodeId}
                onNodeHover={setHoveredNodeId}
                portConflicts={
                  validationResult?.portConflicts.flatMap(c => 
                    c.services.map(s => `svc-${s}`)
                  ) || []
                }
                cycleServices={
                  validationResult?.cycles.flatMap(cycle => 
                    cycle.map(s => `svc-${s}`)
                  ) || []
                }
            />
            
            {/* Node Details Panel */}
            {selectedNode && (
                <NodeDetailsPanel
                    node={selectedNode}
                    onClose={() => setSelectedNode(null)}
                    isDark={isDark}
                />
            )}
            
            {!isEditorOpen && (
                <button 
                    onClick={() => setIsEditorOpen(true)}
                    className="absolute top-4 left-4 z-10 bg-white dark:bg-slate-800 p-2 rounded-lg shadow-md border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-blue-500"
                >
                    <PanelLeftOpen size={20} />
                </button>
            )}

            {/* Validation Panel */}
            <ValidationPanel
                validationResult={validationResult}
                isOpen={isValidationPanelOpen}
                onClose={() => setIsValidationPanelOpen(false)}
                isDark={isDark}
            />
        </div>

      </div>
    </div>
  );
}

export default App;
