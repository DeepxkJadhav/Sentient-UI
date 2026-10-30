export interface WorldState {
  goalDefined: boolean;
  architectureValidated: boolean;
  codeGenerated: boolean;
  testsPassing: boolean;
  securityAudited: boolean;
  memoryIndexed: boolean;
  consensusReached: boolean;
  deployed: boolean;
  [key: string]: boolean | undefined;
}

export interface GOAPAction {
  id: string;
  name: string;
  description: string;
  cost: number;
  assignedRole: string;
  preconditions: Partial<WorldState>;
  effects: Partial<WorldState>;
}

export interface PlanStep {
  id: string;
  order: number;
  action: GOAPAction;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  assignedAgentId?: string;
  startedAt?: string;
  completedAt?: string;
  outputSummary?: string;
  metrics?: { durationMs: number; tokensUsed: number };
}

export interface GoalMission {
  id: string;
  goal: string;
  description: string;
  targetState: Partial<WorldState>;
  initialState: WorldState;
  currentState: WorldState;
  plan: PlanStep[];
  status: 'planning' | 'executing' | 'replanning' | 'completed' | 'failed';
  createdAt: string;
}
