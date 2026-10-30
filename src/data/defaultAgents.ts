import { AgentNode } from '../types/swarm';

export const INITIAL_AGENTS: AgentNode[] = [
  {
    id: 'agent-queen-01',
    name: 'Queen-Orchestrator',
    type: 'queen',
    role: 'queen',
    status: 'idle',
    capabilities: ['orchestration', 'attention-coordination', 'dynamic-topology', 'failover'],
    metrics: {
      tasksCompleted: 42,
      tasksFailed: 0,
      successRate: 100,
      cpuUsage: 18,
      memoryUsage: 34,
      responseTimeMs: 45,
      health: 99
    },
    connections: ['agent-arch-01', 'agent-coder-01', 'agent-sec-01', 'agent-rev-01'],
    x: 400,
    y: 180,
    color: '#a855f7' // Purple / Queen
  },
  {
    id: 'agent-arch-01',
    name: 'Atlas-Architect',
    type: 'architect',
    role: 'coordinator',
    status: 'idle',
    capabilities: ['domain-driven-design', 'adr-stewardship', 'subgraph-analysis', 'system-decomposition'],
    metrics: {
      tasksCompleted: 19,
      tasksFailed: 0,
      successRate: 100,
      cpuUsage: 25,
      memoryUsage: 48,
      responseTimeMs: 65,
      health: 98
    },
    connections: ['agent-queen-01', 'agent-coder-01', 'agent-doc-01'],
    x: 220,
    y: 320,
    color: '#38bdf8' // Cyan / Architect
  },
  {
    id: 'agent-coder-01',
    name: 'Titan-Coder',
    type: 'coder',
    role: 'worker',
    status: 'idle',
    capabilities: ['react19', 'typescript', 'tailwind', 'express', 'mcp-integration'],
    metrics: {
      tasksCompleted: 88,
      tasksFailed: 2,
      successRate: 97.7,
      cpuUsage: 45,
      memoryUsage: 62,
      responseTimeMs: 95,
      health: 96
    },
    connections: ['agent-queen-01', 'agent-arch-01', 'agent-test-01'],
    x: 580,
    y: 320,
    color: '#10b981' // Green / Coder
  },
  {
    id: 'agent-sec-01',
    name: 'Aegis-Security',
    type: 'security-architect',
    role: 'specialist',
    status: 'idle',
    capabilities: ['mcp-sandbox-audit', 'cve-triage', 'threat-modeling', 'privilege-boundary'],
    metrics: {
      tasksCompleted: 31,
      tasksFailed: 0,
      successRate: 100,
      cpuUsage: 22,
      memoryUsage: 41,
      responseTimeMs: 50,
      health: 100
    },
    connections: ['agent-queen-01', 'agent-rev-01'],
    x: 260,
    y: 480,
    color: '#ef4444' // Red / Security
  },
  {
    id: 'agent-rev-01',
    name: 'Krypton-Reviewer',
    type: 'reviewer',
    role: 'peer',
    status: 'idle',
    capabilities: ['ast-diff-audit', 'code-simplification', 'byzantine-vote', 'taste-gate'],
    metrics: {
      tasksCompleted: 54,
      tasksFailed: 1,
      successRate: 98.1,
      cpuUsage: 19,
      memoryUsage: 37,
      responseTimeMs: 58,
      health: 97
    },
    connections: ['agent-queen-01', 'agent-coder-01', 'agent-sec-01'],
    x: 540,
    y: 480,
    color: '#f59e0b' // Amber / Reviewer
  },
  {
    id: 'agent-test-01',
    name: 'Vanguard-Tester',
    type: 'tester',
    role: 'worker',
    status: 'idle',
    capabilities: ['unit-testing', 'e2e-simulation', 'property-testing', 'stress-benchmarking'],
    metrics: {
      tasksCompleted: 67,
      tasksFailed: 0,
      successRate: 100,
      cpuUsage: 30,
      memoryUsage: 55,
      responseTimeMs: 82,
      health: 99
    },
    connections: ['agent-coder-01'],
    x: 720,
    y: 400,
    color: '#ec4899' // Pink / Tester
  },
  {
    id: 'agent-doc-01',
    name: 'Chronicle-Documenter',
    type: 'documenter',
    role: 'specialist',
    status: 'idle',
    capabilities: ['markdown-generation', 'knowledge-graph-docs', 'adr-recording', 'api-spec'],
    metrics: {
      tasksCompleted: 28,
      tasksFailed: 0,
      successRate: 100,
      cpuUsage: 14,
      memoryUsage: 29,
      responseTimeMs: 40,
      health: 100
    },
    connections: ['agent-arch-01'],
    x: 100,
    y: 400,
    color: '#6366f1' // Indigo / Doc
  }
];

export const AVAILABLE_AGENT_PRESETS = [
  { type: 'coder', name: 'DeepSeek-Synthesizer', role: 'worker', defaultCaps: ['code-synthesis', 'refactoring', 'codegen'] },
  { type: 'architect', name: 'Nexus-Architect', role: 'coordinator', defaultCaps: ['system-design', 'adr', 'modularity'] },
  { type: 'reviewer', name: 'Argus-Auditor', role: 'peer', defaultCaps: ['code-review', 'clean-code', 'invariance-check'] },
  { type: 'security-architect', name: 'Cerberus-Guard', role: 'specialist', defaultCaps: ['sandboxing', 'cve-scan', 'mcp-jailbreak-prevention'] },
  { type: 'tester', name: 'Helix-Tester', role: 'worker', defaultCaps: ['tdd', 'e2e-browser', 'stress-load'] },
  { type: 'researcher', name: 'Apollo-Researcher', role: 'worker', defaultCaps: ['neural-search', 'literature-synthesis', 'arxiv-scan'] },
  { type: 'optimizer', name: 'Quantum-Optimizer', role: 'specialist', defaultCaps: ['latency-reduction', 'token-compression', 'cache-tuning'] },
  { type: 'devops', name: 'Docker-Pipeline-Runner', role: 'worker', defaultCaps: ['ci-cd', 'container-ops', 'infra-deploy'] }
];
