export interface McpToolParameter {
  name: string;
  type: string;
  description: string;
  required: boolean;
  default?: any;
}

export interface McpTool {
  name: string;
  namespace: 'swarm' | 'agent' | 'task' | 'memory' | 'intelligence' | 'hooks' | 'agentdb' | 'neural' | 'system';
  description: string;
  parameters: McpToolParameter[];
  returns: string;
  samplePayload?: Record<string, any>;
}

export interface McpExecutionResult {
  toolName: string;
  status: 'success' | 'error';
  executionTimeMs: number;
  output: any;
  timestamp: string;
}
