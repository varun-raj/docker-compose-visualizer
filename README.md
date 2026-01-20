<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Docker Compose Visualizer

A powerful, interactive web application for visualizing and analyzing Docker Compose files. Transform your `docker-compose.yml` into an intuitive graph visualization with comprehensive validation, analysis, and export capabilities.

## Features

### 🎨 Interactive Visualization
- **Graph View**: Visualize services, networks, and volumes as interconnected nodes
- **Layout Options**: Switch between horizontal and vertical layouts
- **Node Details**: Click any node to view its complete configuration
- **Dependency Highlighting**: Hover over nodes to see their connections
- **Search & Filter**: Quickly find nodes by name or filter by type (services/networks/volumes)

### 📝 Advanced Editor
- **Monaco Editor**: Full-featured code editor with YAML syntax highlighting
- **Real-time Validation**: Get instant feedback on YAML syntax errors
- **Auto-format**: Beautify your YAML with one click
- **Dark/Light Theme**: Toggle between themes for comfortable editing

### 🔍 Analysis & Validation
- **Schema Validation**: Validates your docker-compose.yml against Docker Compose schema
- **Port Conflict Detection**: Automatically detects conflicting port mappings
- **Dependency Cycle Detection**: Identifies circular dependencies in your services
- **Security Warnings**: Flags potential security issues and suggests best practices
- **Visual Indicators**: Nodes with issues are highlighted in the graph

### 💾 Import/Export
- **File Upload**: Drag and drop or browse to load docker-compose.yml files
- **File Download**: Export your current YAML configuration
- **Export as Image**: Save visualization as PNG
- **Export as PDF**: Generate PDF with visualization and YAML content
- **Share via URL**: Generate shareable links with encoded YAML

### 🎯 User Experience
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Keyboard Navigation**: Full keyboard support for accessibility
- **Auto-save to URL**: Your configuration is automatically saved in the URL hash
- **Error Handling**: Graceful error messages with helpful suggestions

## Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd docker-compose-visualizer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:5173` (or the port shown in terminal)

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Usage

### Basic Workflow

1. **Load a Docker Compose file**
   - Paste your YAML directly into the editor
   - Click the upload button to load from a file
   - Or open a shared link with encoded YAML

2. **Visualize**
   - The graph automatically updates as you type
   - Click any node to see its details
   - Use search to find specific services

3. **Validate**
   - Click the validation icon to see analysis results
   - Issues are highlighted in the graph
   - Review warnings and suggestions

4. **Export**
   - Use the export menu to save as image or PDF
   - Download the YAML file
   - Share via URL link

### Editor Features

- **Syntax Highlighting**: YAML syntax is color-coded for easy reading
- **Auto-completion**: Monaco Editor provides intelligent suggestions
- **Format Document**: Click the "Format" button to auto-format your YAML
- **Error Markers**: Syntax errors are highlighted with red underlines

### Visualization Features

- **Node Types**:
  - 🔵 **Services**: Blue nodes representing your Docker services
  - ⚪ **Networks**: Gray nodes for Docker networks
  - 🟡 **Volumes**: Amber nodes for Docker volumes

- **Edge Types**:
  - **Blue arrows**: Service dependencies (`depends_on`)
  - **Gray lines**: Network connections
  - **Amber arrows**: Volume mounts

- **Interactions**:
  - **Click**: View node details
  - **Hover**: Highlight connected nodes
  - **Drag**: Reposition nodes (if enabled)
  - **Zoom**: Use controls or mouse wheel

### Validation Features

The validation engine checks for:

- ✅ **Schema Compliance**: Valid Docker Compose structure
- ⚠️ **Port Conflicts**: Multiple services using the same port
- 🔄 **Dependency Cycles**: Circular dependencies between services
- 🔒 **Security Issues**: 
  - Exposed ports on all interfaces
  - Privileged mode usage
  - Root user execution
  - Missing healthchecks

## Technology Stack

- **React 19**: UI framework
- **TypeScript**: Type safety
- **React Flow**: Graph visualization
- **Monaco Editor**: Code editing
- **Dagre**: Graph layout algorithm
- **js-yaml**: YAML parsing
- **Vite**: Build tool and dev server
- **Tailwind CSS**: Styling
- **Lucide React**: Icons

## Project Structure

```
docker-compose-visualizer/
├── components/
│   ├── nodes/           # Node components (Service, Network, Volume)
│   ├── ExportMenu.tsx   # Export functionality
│   ├── MonacoEditor.tsx # Code editor
│   ├── NodeDetailsPanel.tsx # Node details view
│   ├── SearchBar.tsx    # Search and filter
│   ├── ValidationPanel.tsx # Validation results
│   └── Visualizer.tsx   # Main graph component
├── utils/
│   ├── exporter.ts      # Export utilities (PNG/PDF)
│   ├── layout.ts         # Graph layout algorithm
│   ├── parser.ts         # YAML parsing
│   ├── serviceIcons.ts   # Service icon mapping
│   ├── urlEncoder.ts     # URL encoding/decoding
│   └── validator.ts      # Validation engine
├── App.tsx              # Main application component
├── types.ts             # TypeScript type definitions
└── constants.ts         # Default values and constants
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[Add your license here]

## Acknowledgments

- Built with [React Flow](https://reactflow.dev/)
- Icons by [Lucide](https://lucide.dev/)
- Editor powered by [Monaco Editor](https://microsoft.github.io/monaco-editor/)
