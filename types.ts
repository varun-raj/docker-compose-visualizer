import { Node, Edge } from 'reactflow';

export interface ComposeService {
  image?: string;
  build?: string | { context: string };
  ports?: string[];
  volumes?: string[];
  networks?: string[] | Record<string, any>;
  environment?: string[] | Record<string, string>;
  depends_on?: string[] | Record<string, any>;
  container_name?: string;
  command?: string | string[];
}

export interface ComposeNetwork {
  driver?: string;
  external?: boolean;
  name?: string;
}

export interface ComposeVolume {
  driver?: string;
  external?: boolean;
  name?: string;
}

export interface DockerCompose {
  version?: string;
  services?: Record<string, ComposeService>;
  networks?: Record<string, ComposeNetwork>;
  volumes?: Record<string, ComposeVolume>;
}

export interface ParseResult {
  nodes: Node[];
  edges: Edge[];
}

export enum NodeType {
  Service = 'service',
  Network = 'network',
  Volume = 'volume',
}
