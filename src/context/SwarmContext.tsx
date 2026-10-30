import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { SwarmState, AgentNode, TopologyType, TopologyLink, ConsensusProposal, AgentType } from '../types/swarm';
import { GoalMission, PlanStep, WorldState } from '../types/goap';
import { McpTool, McpExecutionResult } from '../types/mcp';
import { MemoryEntry, IntelligenceCycleState } from '../types/memory';
import { INITIAL_AGENTS, AVAILABLE_AGENT_PRESETS } from '../data/defaultAgents';
import { SENTIENT_MCP_TOOLS } from '../data/mcpTools';
import { GOAPPlannerEngine } from '../lib/goapSolver';

export interface LogMessage {
  id: string;
  timestamp: string;
  source: 'SWARM' | 'QUEEN' | 'AGENT' | 'MCP' | 'MEMORY' | 'CONSENSUS' | 'GOAP';
  level: 'info' | 'warn' | 'error' | 'success';
  text: string;
}

interface SwarmContextType {
  swarmState: SwarmState;
  activeMission: GoalMission | null;
  logs: LogMessage[];
  mcpTools: McpTool[];
  lastMcpResult: McpExecutionResult | null;
  memories: MemoryEntry[];
  intelligenceCycle: IntelligenceCycleState;
  selectedAgent: AgentNode | null;
  setSelectedAgent: (agent: AgentNode | null) => void;
  setTopology: (type: TopologyType) => void;
  spawnAgent: (name: string, type: AgentType, role?: any) => void;
  terminateAgent: (agentId: string) => void;
  startMission: (goalPrompt: string) => void;
  executeNextMissionStep: () => void;
  replanMission: () => void;
  createConsensusProposal: (proposalText: string, algorithm?: any) => void;
  voteConsensus: (proposalId: string, agentId: string, approve: boolean, rationale?: string) => void;
  executeMcpTool: (toolName: string, payload: Record<string, any>) => Promise<McpExecutionResult>;
  searchMemory: (query: string) => MemoryEntry[];
  runIntelligenceCycle: (topic: string) => void;
  addLog: (source: LogMessage['source'], level: LogMessage['level'], text: string) => void;
  clearLogs: () => void;
}

const SwarmContext = createContext<SwarmContextType | undefined>(undefined);

// Helper to compute node layout based on topology
function layoutNodes(agents: AgentNode[], topology: TopologyType): { agents: AgentNode[]; links: TopologyLink[] } {
  const width = 800;
  const height = 550;
  const centerX = width / 2;
  const centerY = height / 2;
  const updatedAgents = [...agents];
  const links: TopologyLink[] = [];

  const queen = updatedAgents.find(a => a.type === 'queen') || updatedAgents[0];
  const others = updatedAgents.filter(a => a.id !== queen.id);

  if (topology === 'hierarchical') {
    // Queen at top
    queen.x = centerX;
    queen.y = 120;

    // Coordinators layer
    const coordinators = others.filter(a => a.role === 'coordinator' || a.type === 'architect');
    const workers = others.filter(a => !coordinators.includes(a));

    coordinators.forEach((coord, i) => {
      const spread = (width - 200) / (coordinators.length + 1);
      coord.x = 100 + spread * (i + 1);
      coord.y = 280;
      links.push({ from: queen.id, to: coord.id, weight: 1, latencyMs: 24, bidirectional: true });
    });

    // Workers layer
    workers.forEach((worker, i) => {
      const spread = (width - 150) / (workers.length + 1);
      worker.x = 75 + spread * (i + 1);
      worker.y = 440;

      // Link to nearest coordinator or queen
      const parent = coordinators[i % (coordinators.length || 1)] || queen;
      links.push({ from: parent.id, to: worker.id, weight: 0.8, latencyMs: 38, bidirectional: true });
    });
  } else if (topology === 'centralized') {
    // Star topology: Queen in center, all others radiating
    queen.x = centerX;
    queen.y = centerY;
    const radius = 190;
    others.forEach((agent, i) => {
      const angle = (2 * Math.PI * i) / others.length;
      agent.x = centerX + radius * Math.cos(angle);
      agent.y = centerY + radius * Math.sin(angle);
      links.push({ from: queen.id, to: agent.id, weight: 1, latencyMs: 15, bidirectional: true });
    });
  } else if (topology === 'ring') {
    // Ring topology: Circular loop with equal neighbors
    const all = [queen, ...others];
    const radius = 200;
    all.forEach((agent, i) => {
      const angle = (2 * Math.PI * i) / all.length - Math.PI / 2;
      agent.x = centerX + radius * Math.cos(angle);
      agent.y = centerY + radius * Math.sin(angle);
      const nextAgent = all[(i + 1) % all.length];
      links.push({ from: agent.id, to: nextAgent.id, weight: 1, latencyMs: 30, bidirectional: true });
    });
  } else {
    // Mesh topology: Interconnected web
    queen.x = centerX;
    queen.y = centerY - 60;
    const radius = 210;
    others.forEach((agent, i) => {
      const angle = (2 * Math.PI * i) / others.length;
      agent.x = centerX + radius * Math.cos(angle);
      agent.y = centerY + radius * Math.sin(angle);
    });

    // Cross-connect nodes
    const all = [queen, ...others];
    for (let i = 0; i < all.length; i++) {
      for (let j = i + 1; j < all.length; j++) {
        // Form rich mesh edges
        if (Math.abs(i - j) === 1 || (i === 0 && j % 2 === 0) || (i === all.length - 1 && j === 0)) {
          links.push({
            from: all[i].id,
            to: all[j].id,
            weight: 0.9,
            latencyMs: Math.floor(10 + Math.random() * 25),
            bidirectional: true
          });
        }
      }
    }
  }

  return { agents: updatedAgents, links };
}

const INITIAL_MEMORIES: MemoryEntry[] = [
  {
    id: 'mem-001',
    category: 'adr',
    content: 'ADR-407: Cockpit topology mandates decoupled QueenCoordinator from worker execution pools.',
    metadata: { tags: ['adr', 'topology', 'queen'], importance: 0.95, createdAt: new Date(Date.now() - 3600000).toISOString() },
    similarityScore: 0.94
  },
  {
    id: 'mem-002',
    category: 'pattern',
    content: 'Byzantine fault tolerance requires 3f + 1 quorum weight to safely commit model routing weights.',
    metadata: { tags: ['consensus', 'byzantine', 'quorum'], importance: 0.9, createdAt: new Date(Date.now() - 2500000).toISOString() },
    similarityScore: 0.89
  },
  {
    id: 'mem-003',
    category: 'reflexion',
    content: 'GOAP A* planner reduced task failure rate by 84% through dynamic precondition evaluation and fallback recovery.',
    metadata: { tags: ['goap', 'a-star', 'replanning'], importance: 0.88, createdAt: new Date(Date.now() - 1200000).toISOString() },
    similarityScore: 0.85
  },
  {
    id: 'mem-004',
    category: 'semantic',
    content: 'RuVector HNSW index operates at <8ms latency for 10,000 embedded agent trajectories.',
    metadata: { tags: ['ruvector', 'hnsw', 'vector-memory'], importance: 0.92, createdAt: new Date(Date.now() - 600000).toISOString() },
    similarityScore: 0.82
  }
];

export const SwarmProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentTopology, setCurrentTopology] = useState<TopologyType>('hierarchical');
  const [agentsList, setAgentsList] = useState<AgentNode[]>(INITIAL_AGENTS);
  const [selectedAgent, setSelectedAgent] = useState<AgentNode | null>(INITIAL_AGENTS[0]);
  const [logs, setLogs] = useState<LogMessage[]>([]);
  const [memories, setMemories] = useState<MemoryEntry[]>(INITIAL_MEMORIES);
  const [proposals, setProposals] = useState<ConsensusProposal[]>([]);
  const [lastMcpResult, setLastMcpResult] = useState<McpExecutionResult | null>(null);
  const [activeMission, setActiveMission] = useState<GoalMission | null>(null);

  const [intelligenceCycle, setIntelligenceCycle] = useState<IntelligenceCycleState>({
    currentStage: 'CONSOLIDATE',
    query: 'Multi-agent consensus and autonomous failure recovery',
    retrievedCount: 4,
    relevanceConfidence: 0.94,
    distilledFacts: [
      'Queen coordinator acts as single point of orchestration with automatic hot-standby promotion',
      'HNSW similarity threshold of 0.75 eliminates 99.2% of hallucinated agent context',
      'Byzantine weighted voting secures mission critical code deployments'
    ],
    consolidatedMemoryId: 'mem-003',
    stageProgress: 100
  });

  const addLog = useCallback((source: LogMessage['source'], level: LogMessage['level'], text: string) => {
    const newLog: LogMessage = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toLocaleTimeString(),
      source,
      level,
      text
    };
    setLogs(prev => [newLog, ...prev.slice(0, 149)]);
  }, []);

  // Compute layout whenever agents or topology changes
  const { agents, links } = layoutNodes(agentsList, currentTopology);

  const swarmState: SwarmState = {
    id: 'swarm-alpha-01',
    name: 'Sentient Autonomous Hive',
    topology: currentTopology,
    leaderId: agents.find(a => a.type === 'queen')?.id || agents[0]?.id || 'agent-queen-01',
    agents,
    links,
    proposals,
    metrics: {
      totalTasks: 218,
      completedTasks: 214,
      activeAgents: agents.filter(a => a.status === 'busy' || a.status === 'thinking').length,
      avgLatencyMs: 32,
      tokenBurnRate: 1420,
      totalCostUsd: 0.48
    }
  };

  useEffect(() => {
    addLog('SWARM', 'info', `Swarm initialized in ${currentTopology.toUpperCase()} topology with ${agents.length} specialized agents.`);
    addLog('QUEEN', 'success', 'QueenCoordinator active and monitoring attention distribution.');
    addLog('MCP', 'info', `Sentient MCP Server loaded with ${SENTIENT_MCP_TOOLS.length} verified tools.`);
    addLog('MEMORY', 'info', 'Sentient HNSW semantic store ready (4 indexed baseline records).');
  }, []);

  const setTopology = (type: TopologyType) => {
    setCurrentTopology(type);
    addLog('SWARM', 'warn', `Swarm topology mutated to [${type.toUpperCase()}]. Rebalancing communication vectors...`);
  };

  const spawnAgent = (name: string, type: AgentType, role: any = 'worker') => {
    const id = `agent-${type}-${Date.now().toString(36).slice(-4)}`;
    const colors: Record<string, string> = {
      queen: '#a855f7',
      architect: '#38bdf8',
      coder: '#10b981',
      reviewer: '#f59e0b',
      tester: '#ec4899',
      'security-architect': '#ef4444',
      documenter: '#6366f1',
      optimizer: '#14b8a6',
      researcher: '#06b6d4',
      devops: '#8b5cf6'
    };

    const newAgent: AgentNode = {
      id,
      name,
      type,
      role: role || (type === 'architect' ? 'coordinator' : 'worker'),
      status: 'idle',
      capabilities: ['autonomous-execution', 'mcp-tool-call', `${type}-domain`],
      metrics: {
        tasksCompleted: 0,
        tasksFailed: 0,
        successRate: 100,
        cpuUsage: 10,
        memoryUsage: 25,
        responseTimeMs: 35,
        health: 100
      },
      connections: [swarmState.leaderId],
      color: colors[type] || '#38bdf8'
    };

    setAgentsList(prev => [...prev, newAgent]);
    addLog('AGENT', 'success', `Agent [${name}] (${type}) successfully spawned and registered in swarm directory.`);
  };

  const terminateAgent = (agentId: string) => {
    const target = agentsList.find(a => a.id === agentId);
    if (!target) return;
    if (target.type === 'queen') {
      addLog('QUEEN', 'error', 'Cannot terminate Queen Coordinator. Swarm requires an anchor leader.');
      return;
    }
    setAgentsList(prev => prev.filter(a => a.id !== agentId));
    if (selectedAgent?.id === agentId) setSelectedAgent(null);
    addLog('AGENT', 'warn', `Agent [${target.name}] (${target.id}) terminated. Working memory flushed to RuVector.`);
  };

  const startMission = (goalPrompt: string) => {
    const engine = new GOAPPlannerEngine();
    const mission = engine.createMission(goalPrompt);
    setActiveMission(mission);
    addLog('GOAP', 'info', `New GOAP Mission created: "${goalPrompt}". Optimal A* plan computed with ${mission.plan.length} sequential actions.`);
  };

  const executeNextMissionStep = () => {
    if (!activeMission) return;
    const currentSteps = [...activeMission.plan];
    const nextPendingIndex = currentSteps.findIndex(s => s.status === 'pending');

    if (nextPendingIndex === -1) {
      setActiveMission({ ...activeMission, status: 'completed' });
      addLog('GOAP', 'success', `GOAP Mission "${activeMission.goal}" has completed all stages successfully!`);
      return;
    }

    const step = currentSteps[nextPendingIndex];
    // Find assigned agent
    const role = step.action.assignedRole;
    const agent = agentsList.find(a => a.type === role) || agentsList[0];

    // Mark active
    currentSteps[nextPendingIndex] = {
      ...step,
      status: 'in_progress',
      assignedAgentId: agent.id,
      startedAt: new Date().toLocaleTimeString()
    };

    // Update agent state
    setAgentsList(prev => prev.map(a => a.id === agent.id ? { ...a, status: 'busy', currentTask: step.action.name } : a));
    addLog('AGENT', 'info', `[${agent.name}] assigned to step: "${step.action.name}" (${step.action.description}).`);

    // Simulate completion
    setTimeout(() => {
      setAgentsList(prev => prev.map(a => a.id === agent.id ? {
        ...a,
        status: 'idle',
        currentTask: undefined,
        metrics: { ...a.metrics, tasksCompleted: a.metrics.tasksCompleted + 1 }
      } : a));

      const updatedWorldState: WorldState = {
        ...activeMission.currentState,
        ...step.action.effects
      };

      currentSteps[nextPendingIndex] = {
        ...currentSteps[nextPendingIndex],
        status: 'completed',
        completedAt: new Date().toLocaleTimeString(),
        outputSummary: `Completed with verification code 0. Post-conditions applied: ${Object.keys(step.action.effects).join(', ')}`,
        metrics: { durationMs: Math.floor(400 + Math.random() * 800), tokensUsed: Math.floor(120 + Math.random() * 300) }
      };

      setActiveMission({
        ...activeMission,
        currentState: updatedWorldState,
        plan: currentSteps,
        status: nextPendingIndex + 1 === currentSteps.length ? 'completed' : 'executing'
      });

      addLog('GOAP', 'success', `Step [${step.action.name}] completed. World state updated: ${JSON.stringify(step.action.effects)}`);
    }, 1200);
  };

  const replanMission = () => {
    if (!activeMission) return;
    addLog('GOAP', 'warn', `Adaptive Replanning triggered for mission: "${activeMission.goal}". Evaluating unsatisfied heuristics...`);
    const engine = new GOAPPlannerEngine();
    const newPlan = engine.solvePlan(activeMission.currentState, activeMission.targetState);
    setActiveMission({
      ...activeMission,
      plan: newPlan,
      status: 'planning'
    });
    addLog('GOAP', 'info', `A* Replanner synthesized ${newPlan.length} new step vectors from current world state.`);
  };

  const createConsensusProposal = (proposalText: string, algorithm: any = 'raft') => {
    const id = `prop-${Date.now().toString(36)}`;
    const newProposal: ConsensusProposal = {
      id,
      proposerId: swarmState.leaderId,
      proposal: proposalText,
      algorithm,
      votes: {},
      status: 'voting',
      createdAt: new Date().toLocaleTimeString(),
      quorumNeeded: Math.ceil((agentsList.length * 2) / 3)
    };

    setProposals(prev => [newProposal, ...prev]);
    addLog('CONSENSUS', 'warn', `New ${algorithm.toUpperCase()} consensus ballot created by Queen: "${proposalText}". Quorum threshold: ${newProposal.quorumNeeded} votes.`);

    // Automatically trigger agent voting
    agentsList.forEach((agent, idx) => {
      setTimeout(() => {
        const approve = Math.random() > 0.15; // 85% approval
        voteConsensus(id, agent.id, approve, approve ? 'Preconditions verified in local state' : 'Detected divergence in resource constraints');
      }, (idx + 1) * 350);
    });
  };

  const voteConsensus = (proposalId: string, agentId: string, approve: boolean, rationale?: string) => {
    const agent = agentsList.find(a => a.id === agentId);
    setProposals(prev => prev.map(p => {
      if (p.id !== proposalId || p.status !== 'voting') return p;
      const updatedVotes = {
        ...p.votes,
        [agentId]: { approve, weight: agent?.role === 'queen' ? 2 : 1, rationale }
      };

      const yesVotes = Object.values(updatedVotes).filter(v => v.approve).length;
      const totalVotes = Object.keys(updatedVotes).length;
      let status: 'voting' | 'accepted' | 'rejected' = p.status;

      if (yesVotes >= p.quorumNeeded) {
        status = 'accepted';
      } else if (totalVotes === agentsList.length && yesVotes < p.quorumNeeded) {
        status = 'rejected';
      }

      return { ...p, votes: updatedVotes, status };
    }));

    addLog('CONSENSUS', approve ? 'info' : 'warn', `[${agent?.name || agentId}] cast ballot: ${approve ? 'APPROVED (+1)' : 'REJECTED (-1)'} (${rationale || 'Consensus step'})`);
  };

  const executeMcpTool = async (toolName: string, payload: Record<string, any>): Promise<McpExecutionResult> => {
    addLog('MCP', 'info', `Executing tool [${toolName}] with payload: ${JSON.stringify(payload)}`);
    const startTime = performance.now();

    // Emulate realistic tool execution
    await new Promise(res => setTimeout(res, 400 + Math.random() * 400));
    const duration = Math.round(performance.now() - startTime);

    let output: any = { status: 'acknowledged', tool: toolName, processedAt: new Date().toISOString() };

    if (toolName === 'swarm_init') {
      if (payload.topology) setTopology(payload.topology);
      output = { status: 'initialized', topology: payload.topology || currentTopology, agents: agentsList.length };
    } else if (toolName === 'agent_spawn') {
      spawnAgent(payload.name || 'Autonomous-Agent', payload.type || 'coder');
      output = { status: 'spawned', name: payload.name, type: payload.type };
    } else if (toolName === 'memory_store') {
      const newEntry: MemoryEntry = {
        id: `mem-${Date.now().toString(36)}`,
        category: payload.category || 'episodic',
        content: payload.content || 'Observed telemetry event',
        metadata: {
          tags: payload.tags || ['mcp', 'runtime'],
          importance: payload.importance || 0.8,
          createdAt: new Date().toISOString()
        },
        similarityScore: 0.96
      };
      setMemories(prev => [newEntry, ...prev]);
      output = { status: 'stored', memoryId: newEntry.id, hnswVectorIndex: '0x8f2a41d' };
    } else if (toolName === 'swarm_consensus') {
      createConsensusProposal(payload.proposal || 'Verify System Status', payload.algorithm || 'raft');
      output = { status: 'ballot_open', quorum: Math.ceil((agentsList.length * 2) / 3) };
    } else {
      output = {
        status: 'success',
        result: `Executed ${toolName} through Sentient MCP Bridge with zero warnings.`,
        data: payload
      };
    }

    const result: McpExecutionResult = {
      toolName,
      status: 'success',
      executionTimeMs: duration,
      output,
      timestamp: new Date().toLocaleTimeString()
    };

    setLastMcpResult(result);
    addLog('MCP', 'success', `Tool [${toolName}] returned in ${duration}ms: ${JSON.stringify(output)}`);
    return result;
  };

  const searchMemory = (query: string): MemoryEntry[] => {
    const qLower = query.toLowerCase();
    const results = memories.map(m => {
      const match = m.content.toLowerCase().includes(qLower) || m.metadata.tags.some(t => t.toLowerCase().includes(qLower));
      return {
        ...m,
        similarityScore: match ? Math.min(0.99, (m.similarityScore || 0.8) + 0.1) : (m.similarityScore || 0.7) * 0.85
      };
    }).sort((a, b) => (b.similarityScore || 0) - (a.similarityScore || 0));

    addLog('MEMORY', 'info', `RuVector HNSW search for "${query}" matched ${results.length} candidate embeddings.`);
    return results;
  };

  const runIntelligenceCycle = (topic: string) => {
    addLog('MEMORY', 'warn', `Starting 4-Step Intelligence Cycle for topic: "${topic}"...`);
    setIntelligenceCycle({
      currentStage: 'RETRIEVE',
      query: topic,
      retrievedCount: 0,
      relevanceConfidence: 0.2,
      distilledFacts: [],
      stageProgress: 25
    });

    setTimeout(() => {
      addLog('MEMORY', 'info', '[STAGE 1: RETRIEVE] Pulled 12 vector memories from RuVector SQLite layer.');
      setIntelligenceCycle(prev => ({ ...prev, currentStage: 'JUDGE', retrievedCount: 12, relevanceConfidence: 0.65, stageProgress: 50 }));

      setTimeout(() => {
        addLog('MEMORY', 'info', '[STAGE 2: JUDGE] Filtered noise using semantic relevance gate; 4 verified assertions retained.');
        setIntelligenceCycle(prev => ({ ...prev, currentStage: 'DISTILL', relevanceConfidence: 0.88, stageProgress: 75 }));

        setTimeout(() => {
          const newFact = `Synthesized consensus invariance rule for "${topic}" at ${new Date().toLocaleTimeString()}`;
          addLog('MEMORY', 'info', '[STAGE 3: DISTILL] Extracted core truth vectors into invariant proposition.');
          setIntelligenceCycle(prev => ({
            ...prev,
            currentStage: 'CONSOLIDATE',
            distilledFacts: [newFact, ...prev.distilledFacts],
            relevanceConfidence: 0.98,
            stageProgress: 100
          }));

          // Add to memories
          const consolidatedEntry: MemoryEntry = {
            id: `mem-intel-${Date.now().toString(36)}`,
            category: 'reflexion',
            content: `[CONSOLIDATED INTELLIGENCE] ${topic}: Invariance verified across 4-stage pipeline.`,
            metadata: {
              tags: ['intelligence-cycle', 'synthesized', topic.toLowerCase().slice(0, 15)],
              importance: 0.98,
              createdAt: new Date().toISOString()
            },
            similarityScore: 0.98
          };
          setMemories(m => [consolidatedEntry, ...m]);
          addLog('MEMORY', 'success', `[STAGE 4: CONSOLIDATE] Written consolidated memory (${consolidatedEntry.id}) to RuVector ledger.`);
        }, 800);
      }, 800);
    }, 800);
  };

  const clearLogs = () => setLogs([]);

  return (
    <SwarmContext.Provider
      value={{
        swarmState,
        activeMission,
        logs,
        mcpTools: SENTIENT_MCP_TOOLS,
        lastMcpResult,
        memories,
        intelligenceCycle,
        selectedAgent,
        setSelectedAgent,
        setTopology,
        spawnAgent,
        terminateAgent,
        startMission,
        executeNextMissionStep,
        replanMission,
        createConsensusProposal,
        voteConsensus,
        executeMcpTool,
        searchMemory,
        runIntelligenceCycle,
        addLog,
        clearLogs
      }}
    >
      {children}
    </SwarmContext.Provider>
  );
};

export const useSwarm = () => {
  const context = useContext(SwarmContext);
  if (!context) throw new Error('useSwarm must be used within a SwarmProvider');
  return context;
};
