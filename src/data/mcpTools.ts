import { McpTool } from '../types/mcp';

export const SENTIENT_MCP_TOOLS: McpTool[] = [
  // Swarm Tools
  {
    name: 'swarm_init',
    namespace: 'swarm',
    description: 'Initialize a new multi-agent swarm with chosen topology (mesh, hierarchical, centralized, ring).',
    parameters: [
      { name: 'topology', type: 'string', description: 'mesh | hierarchical | centralized | ring', required: true, default: 'hierarchical' },
      { name: 'maxAgents', type: 'number', description: 'Maximum allowable agents in pool', required: false, default: 8 },
      { name: 'partitionStrategy', type: 'string', description: 'hash | range | round-robin', required: false, default: 'round-robin' },
    ],
    returns: 'SwarmState object with allocated queen and assigned node IDs',
    samplePayload: { topology: 'hierarchical', maxAgents: 10, partitionStrategy: 'round-robin' }
  },
  {
    name: 'swarm_scale',
    namespace: 'swarm',
    description: 'Dynamically scale swarm agent count or rebalance node connections.',
    parameters: [
      { name: 'targetAgents', type: 'number', description: 'New target agent count', required: true, default: 6 },
      { name: 'roleDistribution', type: 'object', description: 'Mapping of role types to desired counts', required: false }
    ],
    returns: 'Rebalanced topology graph and active agent instances',
    samplePayload: { targetAgents: 6 }
  },
  {
    name: 'swarm_topology',
    namespace: 'swarm',
    description: 'Query or reconfigure the active swarm topology model and partition weights.',
    parameters: [
      { name: 'newTopology', type: 'string', description: 'mesh | hierarchical | centralized | ring', required: false }
    ],
    returns: 'Updated TopologyState with active node matrix and link latencies',
    samplePayload: { newTopology: 'mesh' }
  },
  {
    name: 'swarm_consensus',
    namespace: 'swarm',
    description: 'Trigger a distributed consensus voting round across swarm nodes.',
    parameters: [
      { name: 'proposal', type: 'string', description: 'Action or architectural change to propose', required: true },
      { name: 'algorithm', type: 'string', description: 'raft | byzantine | gossip | paxos', required: false, default: 'byzantine' },
      { name: 'timeoutMs', type: 'number', description: 'Timeout in milliseconds', required: false, default: 5000 }
    ],
    returns: 'ConsensusProposal result with ballot tally, status, and quorum approval',
    samplePayload: { proposal: 'Approve production deployment of Sentient-UI v1.0', algorithm: 'byzantine' }
  },

  // Agent Tools
  {
    name: 'agent_spawn',
    namespace: 'agent',
    description: 'Instantiate and register a specialized agent within the active swarm coordinate system.',
    parameters: [
      { name: 'name', type: 'string', description: 'Human-readable agent identifier', required: true },
      { name: 'type', type: 'string', description: 'coder | architect | reviewer | tester | security-architect | researcher', required: true },
      { name: 'capabilities', type: 'array', description: 'List of authorized skill capabilities', required: false }
    ],
    returns: 'AgentNode entity with UUID, communication channel, and health tracker',
    samplePayload: { name: 'DeepSeek-Synthesizer', type: 'coder', capabilities: ['typescript', 'react', 'goap'] }
  },
  {
    name: 'agent_terminate',
    namespace: 'agent',
    description: 'Gracefully deregister and tear down an agent, flushing its working memory to vector store.',
    parameters: [
      { name: 'agentId', type: 'string', description: 'Target agent ID to terminate', required: true }
    ],
    returns: 'Termination status and memory flush summary',
    samplePayload: { agentId: 'agent-coder-01' }
  },
  {
    name: 'agent_delegate',
    namespace: 'agent',
    description: 'Delegate a specific subtask or instruction from Queen/Coordinator to a worker agent.',
    parameters: [
      { name: 'agentId', type: 'string', description: 'Worker agent ID', required: true },
      { name: 'instruction', type: 'string', description: 'Actionable goal prompt', required: true },
      { name: 'context', type: 'object', description: 'Prior task outputs and memory references', required: false }
    ],
    returns: 'Execution handle with streaming task ID',
    samplePayload: { agentId: 'agent-tester-01', instruction: 'Execute end-to-end integration tests on GOAP planner' }
  },

  // Memory Tools
  {
    name: 'memory_store',
    namespace: 'memory',
    description: 'Insert an episodic observation, pattern, or ADR into vector memory with HNSW indexing.',
    parameters: [
      { name: 'content', type: 'string', description: 'Text or code fact to persist', required: true },
      { name: 'category', type: 'string', description: 'episodic | semantic | reflexion | adr | pattern', required: true },
      { name: 'tags', type: 'array', description: 'Filterable search tags', required: false },
      { name: 'importance', type: 'number', description: 'Float from 0.0 to 1.0', required: false, default: 0.8 }
    ],
    returns: 'MemoryEntry ID, vector hash, and storage confirmation',
    samplePayload: { content: 'GOAP A* planner successfully resolved optimal path in 6 hops with zero cycle loops.', category: 'pattern', tags: ['goap', 'a-star'], importance: 0.95 }
  },
  {
    name: 'memory_search',
    namespace: 'memory',
    description: 'Perform semantic vector cosine search against Sentient HNSW index.',
    parameters: [
      { name: 'query', type: 'string', description: 'Natural language search query', required: true },
      { name: 'limit', type: 'number', description: 'Max items to return', required: false, default: 5 },
      { name: 'minSimilarity', type: 'number', description: 'Cosine similarity threshold (0.0 to 1.0)', required: false, default: 0.7 }
    ],
    returns: 'Array of ranked memory items with similarity scores and metadata',
    samplePayload: { query: 'swarm coordination failure recovery patterns', limit: 3, minSimilarity: 0.75 }
  },

  // Intelligence Tools
  {
    name: 'intelligence_cycle',
    namespace: 'intelligence',
    description: 'Execute the 4-phase cognitive memory consolidation pipeline (RETRIEVE -> JUDGE -> DISTILL -> CONSOLIDATE).',
    parameters: [
      { name: 'topic', type: 'string', description: 'Domain focus topic for cognitive consolidation', required: true }
    ],
    returns: 'Synthesized insights, distilled facts, and consolidated memory node reference',
    samplePayload: { topic: 'Autonomous Agent Fault Recovery and Byzantine Quorum Reliability' }
  },

  // Task & Workflow Tools
  {
    name: 'task_create',
    namespace: 'task',
    description: 'Enqueue a task in the swarm distributed DAG with priority and dependencies.',
    parameters: [
      { name: 'name', type: 'string', description: 'Task name', required: true },
      { name: 'description', type: 'string', description: 'Detailed execution specification', required: true },
      { name: 'priority', type: 'string', description: 'critical | high | normal | low', required: false, default: 'normal' },
      { name: 'dependencies', type: 'array', description: 'Array of prerequisite Task IDs', required: false }
    ],
    returns: 'TaskId with queued status and sequence index',
    samplePayload: { name: 'Run Security Threat Model', description: 'Audit all MCP endpoints against unauthorized sandbox escapes', priority: 'high' }
  },

  // Hooks & Self-Learning Tools
  {
    name: 'hooks_pre_edit',
    namespace: 'hooks',
    description: 'Execute pre-edit validation hook to evaluate risk, lint rules, and prevent architectural regressions.',
    parameters: [
      { name: 'filePath', type: 'string', description: 'File about to be changed', required: true },
      { name: 'proposedDiff', type: 'string', description: 'Unified diff of proposed change', required: true }
    ],
    returns: 'Hook decision: ALLOW | WARN | BLOCK with explanatory rationale',
    samplePayload: { filePath: 'src/lib/goapSolver.ts', proposedDiff: '+ public optimizePath() { return true; }' }
  }
];
