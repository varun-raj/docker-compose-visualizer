import yaml from 'js-yaml';
import { Node, Edge, MarkerType } from 'reactflow';
import { DockerCompose, NodeType } from '../types';

export const parseDockerCompose = (yamlContent: string): { nodes: Node[]; edges: Edge[] } => {
  try {
    const compose = yaml.load(yamlContent) as DockerCompose;
    if (!compose || typeof compose !== 'object') {
      return { nodes: [], edges: [] };
    }

    const nodes: Node[] = [];
    const edges: Edge[] = [];
    const services = compose.services || {};
    const networks = compose.networks || {};
    const volumes = compose.volumes || {};
    
    // Track created nodes to avoid duplicates/missing references
    const createdNetworks = new Set<string>();
    const createdVolumes = new Set<string>();

    // 1. Process Networks explicitly defined
    Object.keys(networks).forEach((netName) => {
      nodes.push({
        id: `net-${netName}`,
        type: NodeType.Network,
        position: { x: 0, y: 0 },
        data: { label: netName, details: networks[netName] },
      });
      createdNetworks.add(netName);
    });

    // 2. Process Volumes explicitly defined
    Object.keys(volumes).forEach((volName) => {
      nodes.push({
        id: `vol-${volName}`,
        type: NodeType.Volume,
        position: { x: 0, y: 0 },
        data: { label: volName, details: volumes[volName] },
      });
      createdVolumes.add(volName);
    });

    // 3. Process Services
    Object.entries(services).forEach(([serviceName, serviceConfig]) => {
      const serviceNodeId = `svc-${serviceName}`;
      
      nodes.push({
        id: serviceNodeId,
        type: NodeType.Service,
        position: { x: 0, y: 0 },
        data: { 
          label: serviceName, 
          ...serviceConfig 
        },
      });

      // Handle Networks
      const serviceNetworks = serviceConfig.networks;
      if (serviceNetworks) {
        const netList = Array.isArray(serviceNetworks) 
          ? serviceNetworks 
          : Object.keys(serviceNetworks);
        
        netList.forEach(netName => {
          // If network wasn't explicitly defined in top-level 'networks', create it implicitly (common in simpler compose files)
          // or assume it's external/default. For visualization, we'll create a node if missing.
          if (!createdNetworks.has(netName)) {
             nodes.push({
                id: `net-${netName}`,
                type: NodeType.Network,
                position: { x: 0, y: 0 },
                data: { label: netName, implicit: true },
              });
              createdNetworks.add(netName);
          }

          edges.push({
            id: `e-${serviceNodeId}-net-${netName}`,
            source: serviceNodeId,
            target: `net-${netName}`,
            type: 'default',
            animated: true,
            style: { stroke: '#64748b' },
          });
        });
      } else {
        // Implicit 'default' network if no networks specified
        const defaultNet = 'default';
        if (!createdNetworks.has(defaultNet)) {
             nodes.push({
                id: `net-${defaultNet}`,
                type: NodeType.Network,
                position: { x: 0, y: 0 },
                data: { label: defaultNet, implicit: true },
              });
              createdNetworks.add(defaultNet);
        }
        edges.push({
            id: `e-${serviceNodeId}-net-${defaultNet}`,
            source: serviceNodeId,
            target: `net-${defaultNet}`,
            type: 'default',
            animated: true,
            style: { stroke: '#94a3b8', strokeDasharray: '5,5' },
        });
      }

      // Handle Volumes
      if (serviceConfig.volumes) {
        serviceConfig.volumes.forEach((vol: string | any) => {
          // Parse short syntax "volname:/path"
          let volName = '';
          if (typeof vol === 'string') {
             const parts = vol.split(':');
             if (parts.length > 0) {
                 // Check if it's a host path or named volume. Named volumes usually don't start with / or ./
                 const source = parts[0];
                 if (!source.startsWith('.') && !source.startsWith('/')) {
                     volName = source;
                 }
             }
          } else if (typeof vol === 'object' && vol.source) {
              volName = vol.source;
          }

          if (volName) {
            if (!createdVolumes.has(volName)) {
                nodes.push({
                    id: `vol-${volName}`,
                    type: NodeType.Volume,
                    position: { x: 0, y: 0 },
                    data: { label: volName, implicit: true },
                });
                createdVolumes.add(volName);
            }
            edges.push({
                id: `e-${serviceNodeId}-vol-${volName}`,
                source: serviceNodeId,
                target: `vol-${volName}`,
                type: 'default',
                style: { stroke: '#f59e0b' },
                markerEnd: { type: MarkerType.ArrowClosed, color: '#f59e0b' }
            });
          }
        });
      }

      // Handle Depends On
      if (serviceConfig.depends_on) {
        const deps = Array.isArray(serviceConfig.depends_on)
          ? serviceConfig.depends_on
          : Object.keys(serviceConfig.depends_on);
        
        deps.forEach(dep => {
           edges.push({
                id: `e-${serviceNodeId}-dep-${dep}`,
                source: serviceNodeId,
                target: `svc-${dep}`,
                type: 'smoothstep',
                animated: true,
                style: { stroke: '#3b82f6', strokeWidth: 2 },
                markerEnd: { type: MarkerType.ArrowClosed, color: '#3b82f6' },
                label: 'depends_on'
           });
        });
      }
      
      // Handle Links (Legacy but still used)
       if ((serviceConfig as any).links) {
        const links = (serviceConfig as any).links as string[];
        links.forEach(link => {
            const targetName = link.split(':')[0]; // handle service:alias
             edges.push({
                id: `e-${serviceNodeId}-link-${targetName}`,
                source: serviceNodeId,
                target: `svc-${targetName}`,
                type: 'smoothstep',
                style: { stroke: '#8b5cf6' },
                markerEnd: { type: MarkerType.ArrowClosed, color: '#8b5cf6' },
                label: 'links'
           });
        });
      }
    });

    return { nodes, edges };
  } catch (error) {
    console.error("Failed to parse YAML", error);
    return { nodes: [], edges: [] };
  }
};
