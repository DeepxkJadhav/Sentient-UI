export type TopologyType = 'mesh' | 'hierarchical' | 'centralized' | 'ring' | 'hybrid';

export type AgentRole = 'queen' | 'worker' | 'coordinator' | 'peer' | 'specialist';

export type AgentType =
  | 'queen'
  | 'coordinator'
  | 'architect'
  | 'coder'
  | 'reviewer'
  | 'tester'
  | 'security-architect'
  | 'researcher'
  | 'optimizer'
  | 'documenter'
  | 'devops'
  | 'analyst';

export type AgentStatus =
  | 'initializing'
  | 'idle'
  | 'busy'
  | 'thinking'
  | 'consensus'
  | 'error'
  | 'offline';

export interface AgentMetrics {
  tasksCompleted: number;
  tasksFailed: number;
  successRate: number;
  cpuUsage: number;
  memoryUsage: number;
  responseTimeMs: number;
  health: number; // 0 - 100
}

export interface AgentNode {
  id: string;
  name: string;
  type: AgentType;
  role: AgentRole;
  status: AgentStatus;
  capabilities: string[];
  metrics: AgentMetrics;
  currentTask?: string;
  connections: string[];
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  color?: string;
}

export interface TopologyLink {
  from: string;
  to: string;
  weight: number;
  latencyMs: number;
  bidirectional: boolean;
  activePackets?: { progress: number; payload: string }[];
}

export interface ConsensusProposal {
  id: string;
  proposerId: string;
  proposal: string;
  algorithm: 'raft' | 'byzantine' | 'gossip' | 'paxos';
  votes: Record<string, { approve: boolean; weight: number; rationale?: string }>;
  status: 'voting' | 'accepted' | 'rejected';
  createdAt: string;
  quorumNeeded: number;
}

export interface SwarmState {
  id: string;
  name: string;
  topology: TopologyType;
  leaderId: string;
  agents: AgentNode[];
  links: TopologyLink[];
  proposals: ConsensusProposal[];
  metrics: {
    totalTasks: number;
    completedTasks: number;
    activeAgents: number;
    avgLatencyMs: number;
    tokenBurnRate: number;
    totalCostUsd: number;
  };
}
