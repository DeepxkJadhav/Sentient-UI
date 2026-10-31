import { WorldState, GOAPAction, PlanStep, GoalMission } from '../types/goap';

export const DEFAULT_ACTIONS: GOAPAction[] = [
  {
    id: 'act-goal-parse',
    name: 'Parse & Decompose Goal',
    description: 'Analyze natural language objectives and extract atomic preconditions and success criteria.',
    cost: 1,
    assignedRole: 'architect',
    preconditions: {},
    effects: { goalDefined: true }
  },
  {
    id: 'act-arch-design',
    name: 'Design System Architecture & ADR',
    description: 'Construct component interaction contracts, topology models, and formal ADR specifications.',
    cost: 2,
    assignedRole: 'architect',
    preconditions: { goalDefined: true },
    effects: { architectureValidated: true }
  },
  {
    id: 'act-code-gen',
    name: 'Synthesize Production Components',
    description: 'Implement typed UI, state models, MCP tool handlers, and swarm communication buses.',
    cost: 4,
    assignedRole: 'coder',
    preconditions: { architectureValidated: true },
    effects: { codeGenerated: true }
  },
  {
    id: 'act-test-suite',
    name: 'Execute Verification & Test Suite',
    description: 'Run unit, integration, and stress tests to verify invariance and state machine integrity.',
    cost: 2,
    assignedRole: 'tester',
    preconditions: { codeGenerated: true },
    effects: { testsPassing: true }
  },
  {
    id: 'act-sec-audit',
    name: 'Conduct MCP Security & Sandbox Audit',
    description: 'Validate token boundaries, sandbox escapes, authorization gates, and payload sanitization.',
    cost: 3,
    assignedRole: 'security-architect',
    preconditions: { codeGenerated: true },
    effects: { securityAudited: true }
  },
  {
    id: 'act-mem-index',
    name: 'Index Knowledge & Reflexions to Vector Memory',
    description: 'Consolidate execution learnings, vector embeddings, and patterns into HNSW memory store.',
    cost: 1,
    assignedRole: 'architect',
    preconditions: { testsPassing: true, securityAudited: true },
    effects: { memoryIndexed: true }
  },
  {
    id: 'act-consensus-vote',
    name: 'Swarm Byzantine Consensus Gate',
    description: 'Hold a weighted quorum ballot across all active swarm peer nodes to approve release readiness.',
    cost: 2,
    assignedRole: 'queen',
    preconditions: { memoryIndexed: true, testsPassing: true, securityAudited: true },
    effects: { consensusReached: true }
  },
  {
    id: 'act-deploy-release',
    name: 'Finalize & Launch Sentient-UI Engine',
    description: 'Transition active swarm to live operations and activate telemetry streams.',
    cost: 2,
    assignedRole: 'queen',
    preconditions: { consensusReached: true },
    effects: { deployed: true }
  }
];

export class GOAPPlannerEngine {
  private actions: GOAPAction[];

  constructor(actions: GOAPAction[] = DEFAULT_ACTIONS) {
    this.actions = actions;
  }

  private heuristic(current: WorldState, target: Partial<WorldState>): number {
    let distance = 0;
    for (const key in target) {
      if (target[key] === true && !current[key]) {
        distance++;
      }
    }
    return distance;
  }

  private preconditionsMet(state: WorldState, preconditions: Partial<WorldState>): boolean {
    for (const key in preconditions) {
      if (preconditions[key] !== undefined && state[key] !== preconditions[key]) {
        return false;
      }
    }
    return true;
  }

  private applyEffects(state: WorldState, effects: Partial<WorldState>): WorldState {
    return { ...state, ...effects };
  }

  private stateHash(state: WorldState): string {
    return Object.keys(state).sort().map(k => `${k}:${state[k]}`).join('|');
  }

  public solvePlan(initialState: WorldState, targetState: Partial<WorldState>): PlanStep[] {
    interface SearchNode {
      state: WorldState;
      actionSequence: GOAPAction[];
      gCost: number;
      hCost: number;
      fCost: number;
    }

    const startNode: SearchNode = {
      state: { ...initialState },
      actionSequence: [],
      gCost: 0,
      hCost: this.heuristic(initialState, targetState),
      fCost: this.heuristic(initialState, targetState)
    };

    const openList: SearchNode[] = [startNode];
    const closedSet = new Set<string>();

    let bestSolution: GOAPAction[] | null = null;
    let iterations = 0;
    const maxIterations = 500;

    while (openList.length > 0 && iterations++ < maxIterations) {
      // Find node with lowest fCost
      openList.sort((a, b) => a.fCost - b.fCost);
      const current = openList.shift()!;

      // Check if target conditions are satisfied
      let goalMet = true;
      for (const key in targetState) {
        if (targetState[key] === true && !current.state[key]) {
          goalMet = false;
          break;
        }
      }

      if (goalMet) {
        bestSolution = current.actionSequence;
        break;
      }

      const hash = this.stateHash(current.state);
      if (closedSet.has(hash)) continue;
      closedSet.add(hash);

      for (const action of this.actions) {
        if (this.preconditionsMet(current.state, action.preconditions)) {
          const nextState = this.applyEffects(current.state, action.effects);
          const nextHash = this.stateHash(nextState);

          if (!closedSet.has(nextHash)) {
            const gCost = current.gCost + action.cost;
            const hCost = this.heuristic(nextState, targetState);
            openList.push({
              state: nextState,
              actionSequence: [...current.actionSequence, action],
              gCost,
              hCost,
              fCost: gCost + hCost
            });
          }
        }
      }
    }

    if (!bestSolution) {
      // Fallback: Return linear actions matching prerequisites
      bestSolution = this.actions.filter(a => this.preconditionsMet(initialState, a.preconditions));
    }

    return bestSolution.map((act, index) => ({
      id: `step-${index + 1}-${act.id}`,
      order: index + 1,
      action: act,
      status: 'pending'
    }));
  }

  public createMission(goal: string, targetState: Partial<WorldState> = { deployed: true }): GoalMission {
    const initialState: WorldState = {
      goalDefined: false,
      architectureValidated: false,
      codeGenerated: false,
      testsPassing: false,
      securityAudited: false,
      memoryIndexed: false,
      consensusReached: false,
      deployed: false
    };

    const plan = this.solvePlan(initialState, targetState);

    return {
      id: `mission-${Date.now().toString(36)}`,
      goal,
      description: `Autonomous GOAP mission to achieve [${goal}] via ${plan.length}-stage coordinated swarm execution`,
      initialState,
      currentState: { ...initialState },
      targetState,
      plan,
      status: 'planning',
      createdAt: new Date().toISOString()
    };
  }
}
