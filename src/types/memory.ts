export interface MemoryEntry {
  id: string;
  category: 'episodic' | 'semantic' | 'reflexion' | 'adr' | 'pattern';
  content: string;
  metadata: {
    swarmId?: string;
    agentId?: string;
    tags: string[];
    importance: number; // 0.0 - 1.0
    createdAt: string;
  };
  embeddingDimension?: number;
  similarityScore?: number;
}

export type PipelineStage = 'RETRIEVE' | 'JUDGE' | 'DISTILL' | 'CONSOLIDATE';

export interface IntelligenceCycleState {
  currentStage: PipelineStage;
  query: string;
  retrievedCount: number;
  relevanceConfidence: number;
  distilledFacts: string[];
  consolidatedMemoryId?: string;
  stageProgress: number; // 0 - 100
}
