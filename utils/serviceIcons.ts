import React from 'react';
import { IconType } from 'react-icons';
import { Container, LucideIcon } from 'lucide-react';
import {
  SiPostgresql,
  SiRedis,
  SiNginx,
  SiMysql,
  SiMariadb,
  SiMongodb,
  SiNodedotjs,
  SiPython,
  SiGo,
  SiDocker,
  SiElasticsearch,
  SiRabbitmq,
  SiApache,
  SiTraefikproxy,
  SiGrafana,
  SiPrometheus,
  SiInfluxdb,
  SiNeo4J,
  SiElastic,
  SiKubernetes,
  SiReact,
  SiNextdotjs,
  SiVuedotjs,
  SiAngular,
  SiDjango,
  SiFlask,
  SiExpress,
  SiFastapi,
} from 'react-icons/si';

type IconComponent = IconType | LucideIcon;

// Mapping of service name patterns to icon components
const SERVICE_ICON_MAP: Record<string, IconType> = {
  // Databases
  postgres: SiPostgresql,
  postgresql: SiPostgresql,
  pg: SiPostgresql,
  redis: SiRedis,
  mysql: SiMysql,
  mariadb: SiMariadb,
  mongodb: SiMongodb,
  mongo: SiMongodb,
  elasticsearch: SiElasticsearch,
  elastic: SiElastic,
  neo4j: SiNeo4J,
  influxdb: SiInfluxdb,
  influx: SiInfluxdb,

  // Web Servers & Proxies
  nginx: SiNginx,
  apache: SiApache,
  traefik: SiTraefikproxy,

  // Message Brokers
  rabbitmq: SiRabbitmq,
  rabbit: SiRabbitmq,

  // Monitoring & Observability
  grafana: SiGrafana,
  prometheus: SiPrometheus,

  // Languages & Runtimes
  node: SiNodedotjs,
  nodejs: SiNodedotjs,
  python: SiPython,
  golang: SiGo,
  go: SiGo,

  // Web Frameworks
  react: SiReact,
  nextjs: SiNextdotjs,
  next: SiNextdotjs,
  vue: SiVuedotjs,
  angular: SiAngular,
  django: SiDjango,
  flask: SiFlask,
  express: SiExpress,
  fastapi: SiFastapi,

  // Infrastructure
  docker: SiDocker,
  kubernetes: SiKubernetes,
  k8s: SiKubernetes,
};

/**
 * Gets the appropriate icon component for a service name
 * @param serviceName - The name of the service (e.g., "postgres", "redis", "frontend")
 * @returns The icon component or Container as default
 */
export const getServiceIcon = (serviceName: string): IconComponent => {
  if (!serviceName) {
    return Container;
  }

  // Normalize service name: lowercase, trim, remove special characters
  const normalized = serviceName.toLowerCase().trim().replace(/[^a-z0-9]/g, '');

  // Direct match
  if (SERVICE_ICON_MAP[normalized]) {
    return SERVICE_ICON_MAP[normalized];
  }

  // Partial match - check if service name contains any key
  for (const [key, icon] of Object.entries(SERVICE_ICON_MAP)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return icon;
    }
  }

  // Default fallback
  return Container;
};
