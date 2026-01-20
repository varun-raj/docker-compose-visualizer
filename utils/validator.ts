import yaml from 'js-yaml';
import { DockerCompose, ComposeService } from '../types';

export interface ValidationIssue {
  type: 'error' | 'warning' | 'info';
  message: string;
  service?: string;
  field?: string;
  line?: number;
}

export interface ValidationResult {
  isValid: boolean;
  issues: ValidationIssue[];
  portConflicts: PortConflict[];
  cycles: string[][];
  securityWarnings: ValidationIssue[];
}

export interface PortConflict {
  port: string;
  services: string[];
}

/**
 * Validate docker-compose YAML structure
 */
export const validateDockerCompose = (yamlContent: string): ValidationResult => {
  const issues: ValidationIssue[] = [];
  let compose: DockerCompose | null = null;

  // Parse YAML
  try {
    compose = yaml.load(yamlContent) as DockerCompose;
    if (!compose || typeof compose !== 'object') {
      issues.push({
        type: 'error',
        message: 'Invalid YAML structure',
      });
      return {
        isValid: false,
        issues,
        portConflicts: [],
        cycles: [],
        securityWarnings: [],
      };
    }
  } catch (error: any) {
    issues.push({
      type: 'error',
      message: `YAML parsing error: ${error.message}`,
      line: error.mark?.line,
    });
    return {
      isValid: false,
      issues,
      portConflicts: [],
      cycles: [],
      securityWarnings: [],
    };
  }

  const services = compose.services || {};
  const portConflicts = detectPortConflicts(services);
  const cycles = detectDependencyCycles(services);
  const securityWarnings = detectSecurityIssues(services);

  // Check for common issues
  Object.entries(services).forEach(([serviceName, service]) => {
    // Check for missing image or build
    if (!service.image && !service.build) {
      issues.push({
        type: 'error',
        message: 'Service must have either image or build specified',
        service: serviceName,
        field: 'image/build',
      });
    }

    // Check for invalid depends_on
    if (service.depends_on) {
      const deps = Array.isArray(service.depends_on)
        ? service.depends_on
        : Object.keys(service.depends_on);
      
      deps.forEach((dep) => {
        if (!services[dep]) {
          issues.push({
            type: 'warning',
            message: `Service depends on '${dep}' which is not defined`,
            service: serviceName,
            field: 'depends_on',
          });
        }
      });
    }

    // Check for invalid networks
    if (service.networks) {
      const netList = Array.isArray(service.networks)
        ? service.networks
        : Object.keys(service.networks);
      
      const definedNetworks = Object.keys(compose.networks || {});
      netList.forEach((net) => {
        if (!definedNetworks.includes(net) && net !== 'default') {
          issues.push({
            type: 'info',
            message: `Network '${net}' is not explicitly defined (will use default)`,
            service: serviceName,
            field: 'networks',
          });
        }
      });
    }
  });

  return {
    isValid: issues.filter(i => i.type === 'error').length === 0,
    issues,
    portConflicts,
    cycles,
    securityWarnings,
  };
};

/**
 * Detect port conflicts across services
 */
export const detectPortConflicts = (services: Record<string, ComposeService>): PortConflict[] => {
  const portMap = new Map<string, string[]>();

  Object.entries(services).forEach(([serviceName, service]) => {
    if (service.ports) {
      service.ports.forEach((port) => {
        let publishedPort: string;
        
        if (typeof port === 'string') {
          // Format: "host:container" or just "container"
          const parts = port.split(':');
          publishedPort = parts[0];
        } else if (typeof port === 'object' && port.published) {
          publishedPort = String(port.published);
        } else {
          return;
        }

        if (!portMap.has(publishedPort)) {
          portMap.set(publishedPort, []);
        }
        portMap.get(publishedPort)!.push(serviceName);
      });
    }
  });

  const conflicts: PortConflict[] = [];
  portMap.forEach((serviceNames, port) => {
    if (serviceNames.length > 1) {
      conflicts.push({
        port,
        services: serviceNames,
      });
    }
  });

  return conflicts;
};

/**
 * Detect circular dependencies using DFS
 */
export const detectDependencyCycles = (services: Record<string, ComposeService>): string[][] => {
  const cycles: string[][] = [];
  const visited = new Set<string>();
  const recStack = new Set<string>();
  const graph = new Map<string, string[]>();

  // Build dependency graph
  Object.entries(services).forEach(([serviceName, service]) => {
    if (service.depends_on) {
      const deps = Array.isArray(service.depends_on)
        ? service.depends_on
        : Object.keys(service.depends_on);
      graph.set(serviceName, deps.filter(dep => services[dep] !== undefined));
    } else {
      graph.set(serviceName, []);
    }
  });

  const dfs = (node: string, path: string[]): void => {
    visited.add(node);
    recStack.add(node);
    path.push(node);

    const neighbors = graph.get(node) || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        dfs(neighbor, [...path]);
      } else if (recStack.has(neighbor)) {
        // Found a cycle
        const cycleStart = path.indexOf(neighbor);
        if (cycleStart !== -1) {
          cycles.push([...path.slice(cycleStart), neighbor]);
        }
      }
    }

    recStack.delete(node);
  };

  // Check all nodes for cycles
  Object.keys(services).forEach((serviceName) => {
    if (!visited.has(serviceName)) {
      dfs(serviceName, []);
    }
  });

  return cycles;
};

/**
 * Detect security and best practice issues
 */
export const detectSecurityIssues = (services: Record<string, ComposeService>): ValidationIssue[] => {
  const warnings: ValidationIssue[] = [];

  Object.entries(services).forEach(([serviceName, service]) => {
    // Check for exposed ports without restrictions
    if (service.ports) {
      service.ports.forEach((port) => {
        if (typeof port === 'string' && port.includes(':')) {
          const parts = port.split(':');
          if (parts[0] === '0.0.0.0' || parts[0] === '*') {
            warnings.push({
              type: 'warning',
              message: 'Port exposed on all interfaces (0.0.0.0). Consider restricting to specific IP.',
              service: serviceName,
              field: 'ports',
            });
          }
        }
      });
    }

    // Check for privileged mode (if we can detect it)
    if ((service as any).privileged === true) {
      warnings.push({
        type: 'warning',
        message: 'Service runs in privileged mode, which has security implications',
        service: serviceName,
        field: 'privileged',
      });
    }

    // Check for user: root (if we can detect it)
    if ((service as any).user === 'root' || (service as any).user === '0') {
      warnings.push({
        type: 'warning',
        message: 'Service runs as root user. Consider using a non-root user.',
        service: serviceName,
        field: 'user',
      });
    }

    // Check for missing healthchecks
    if (!(service as any).healthcheck && service.image && !service.build) {
      warnings.push({
        type: 'info',
        message: 'Consider adding a healthcheck for better container management',
        service: serviceName,
        field: 'healthcheck',
      });
    }
  });

  return warnings;
};
