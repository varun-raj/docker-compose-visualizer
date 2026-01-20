import React, { useRef } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import type { editor } from 'monaco-editor';

interface MonacoEditorProps {
  value: string;
  onChange: (value: string) => void;
  isDark: boolean;
  onValidationChange?: (markers: editor.IMarker[]) => void;
  editorRef?: React.MutableRefObject<editor.IStandaloneCodeEditor | null>;
}

export const MonacoEditor: React.FC<MonacoEditorProps> = ({
  value,
  onChange,
  isDark,
  onValidationChange,
  editorRef: externalEditorRef,
}) => {
  const internalEditorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const editorRef = externalEditorRef || internalEditorRef;

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    
    // Configure editor
    editor.updateOptions({
      minimap: { enabled: false },
      fontSize: 13,
      lineNumbers: 'on',
      renderLineHighlight: 'all',
      scrollBeyondLastLine: false,
      wordWrap: 'on',
      automaticLayout: true,
    });

    // Listen for validation markers
    if (onValidationChange) {
      const model = editor.getModel();
      if (model) {
        const updateMarkers = () => {
          const markers = monaco.editor.getModelMarkers({ resource: model.uri });
          onValidationChange(markers);
        };
        
        // Use monaco.editor.onDidChangeMarkers instead of model.onDidChangeMarkers
        const disposable = monaco.editor.onDidChangeMarkers((uris) => {
          if (uris.includes(model.uri)) {
            updateMarkers();
          }
        });
        
        // Initial update
        updateMarkers();
        
        // Cleanup on unmount
        editor.onDidDispose(() => {
          disposable.dispose();
        });
      }
    }
  };

  return (
    <Editor
      height="100%"
      defaultLanguage="yaml"
      theme={isDark ? 'vs-dark' : 'vs'}
      value={value}
      onChange={(val) => onChange(val || '')}
      onMount={handleEditorDidMount}
      options={{
        minimap: { enabled: false },
        fontSize: 13,
        lineNumbers: 'on',
        renderLineHighlight: 'all',
        scrollBeyondLastLine: false,
        wordWrap: 'on',
        automaticLayout: true,
        tabSize: 2,
        insertSpaces: true,
        formatOnPaste: true,
        formatOnType: true,
      }}
    />
  );
};
