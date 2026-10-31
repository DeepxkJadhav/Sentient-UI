import React, { useState } from 'react';
import { useSwarm } from '../context/SwarmContext';
import { MemoryEntry, PipelineStage } from '../types/memory';
import { 
  Database, 
  Search, 
  Plus, 
  BrainCircuit, 
  ArrowRight, 
  CheckCircle2, 
  Tag, 
  Star,
  Activity,
  Layers
} from 'lucide-react';

export const MemoryExplorer: React.FC = () => {
  const { memories, searchMemory, intelligenceCycle, runIntelligenceCycle, executeMcpTool } = useSwarm();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [topicPrompt, setTopicPrompt] = useState('Autonomous Fault Recovery & Quorum Invariance');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState<MemoryEntry['category']>('pattern');

  const categories = ['all', 'adr', 'reflexion', 'pattern', 'episodic', 'semantic'];

  const displayedMemories = searchQuery
    ? searchMemory(searchQuery)
    : memories.filter(m => selectedCategory === 'all' || m.category === selectedCategory);

  const stages: { id: PipelineStage; label: string; desc: string }[] = [
    { id: 'RETRIEVE', label: '1. Retrieve', desc: 'Vector cosine match' },
    { id: 'JUDGE', label: '2. Judge', desc: 'Relevance scoring gate' },
    { id: 'DISTILL', label: '3. Distill', desc: 'Invariant truth extraction' },
    { id: 'CONSOLIDATE', label: '4. Consolidate', desc: 'Commit to Vector Memory' }
  ];

  const handleAddMemory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) return;
    await executeMcpTool('memory_store', {
      content: newContent.trim(),
      category: newCategory,
      tags: ['manual-entry', newCategory],
      importance: 0.9
    });
    setNewContent('');
  };

  return (
    <div className="flex flex-col lg:flex-row h-full gap-4 p-4">
      {/* Left Column: 4-Stage Intelligence Cycle Control Plane */}
      <div className="w-full lg:w-96 flex flex-col gap-4">
        {/* Intelligence Cycle Card */}
        <div className="bg-slate-950/90 rounded-2xl border border-slate-800 p-5 shadow-2xl">
          <div className="flex items-center space-x-2 mb-3">
            <div className="p-2 rounded-lg bg-purple-950/80 border border-purple-800/80 text-purple-400">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wide">
                4-Stage Intelligence Cycle
              </h3>
              <p className="text-[11px] text-slate-400">Vector Memory Cognitive Memory Loop</p>
            </div>
          </div>

          <div className="space-y-3 mb-4">
            <div>
              <label className="text-xs font-mono text-slate-400 block mb-1 uppercase">Topic of Consolidation</label>
              <input
                type="text"
                value={topicPrompt}
                onChange={e => setTopicPrompt(e.target.value)}
                placeholder="Topic..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 font-mono"
              />
            </div>

            <button
              onClick={() => runIntelligenceCycle(topicPrompt)}
              className="w-full py-2 px-3 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white rounded-xl text-xs font-mono font-bold transition shadow-lg shadow-purple-600/20"
            >
              Trigger Cognitive Loop
            </button>
          </div>

          {/* Interactive Stage Pipeline Visualizer */}
          <div className="space-y-2">
            {stages.map((st, i) => {
              const isCurrent = intelligenceCycle.currentStage === st.id;
              const stageOrder = ['RETRIEVE', 'JUDGE', 'DISTILL', 'CONSOLIDATE'];
              const isDone = stageOrder.indexOf(intelligenceCycle.currentStage) > i;

              return (
                <div
                  key={st.id}
                  className={`p-2.5 rounded-xl border text-xs font-mono transition ${
                    isCurrent
                      ? 'bg-purple-950/40 border-purple-500 text-purple-300 shadow-md shadow-purple-500/10'
                      : isDone
                      ? 'bg-slate-900/60 border-slate-800 text-emerald-400'
                      : 'bg-slate-900/30 border-slate-800/50 text-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold flex items-center gap-1.5">
                      {isDone && '✓'} {st.label}
                    </span>
                    <span className="text-[10px] text-slate-400 uppercase">{st.desc}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Distilled Facts Output */}
          {intelligenceCycle.distilledFacts.length > 0 && (
            <div className="mt-4 p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] uppercase font-mono text-purple-400 font-bold block mb-1">
                Distilled Invariants
              </span>
              <ul className="text-xs text-slate-300 font-mono space-y-1 list-disc list-inside">
                {intelligenceCycle.distilledFacts.map((fact, idx) => (
                  <li key={idx} className="line-clamp-2">{fact}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Manual Memory Insert Form */}
        <div className="bg-slate-950/90 rounded-2xl border border-slate-800 p-5 shadow-2xl">
          <h4 className="text-xs font-bold text-slate-300 uppercase font-mono tracking-wide flex items-center gap-1.5 mb-3">
            <Plus className="w-4 h-4 text-cyan-400" />
            Commit Knowledge Entry
          </h4>

          <form onSubmit={handleAddMemory} className="space-y-3">
            <textarea
              value={newContent}
              onChange={e => setNewContent(e.target.value)}
              placeholder="Record observation, architectural pattern, or invariant..."
              rows={3}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono resize-none"
            />

            <div className="flex gap-2">
              <select
                value={newCategory}
                onChange={e => setNewCategory(e.target.value as any)}
                className="bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-300 font-mono focus:outline-none"
              >
                <option value="pattern">pattern</option>
                <option value="adr">adr</option>
                <option value="reflexion">reflexion</option>
                <option value="semantic">semantic</option>
                <option value="episodic">episodic</option>
              </select>

              <button
                type="submit"
                className="flex-1 py-1.5 px-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-mono font-semibold transition"
              >
                Save to Vector Memory
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Right Column: Vector Semantic Ledger */}
      <div className="flex-1 flex flex-col bg-slate-950/90 rounded-2xl border border-slate-800 p-5 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wide flex items-center gap-2">
              <Database className="w-4 h-4 text-cyan-400" />
              Vector Semantic Ledger ({displayedMemories.length})
            </h3>
            <p className="text-xs text-slate-400 font-mono">HNSW Vector Embeddings & Hybrid SQLite Storage</p>
          </div>
        </div>

        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row gap-3 my-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Query vector semantic space..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>

          <div className="flex flex-wrap gap-1">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-[10px] px-2.5 py-1 rounded-lg font-mono uppercase transition ${
                  selectedCategory === cat
                    ? 'bg-purple-600/30 text-purple-300 border border-purple-500/40 font-bold'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Memory Items List */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
          {displayedMemories.map(item => (
            <div key={item.id} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase bg-cyan-950 text-cyan-400 border border-cyan-800">
                    {item.category}
                  </span>
                  <span className="text-xs font-mono text-slate-400">{item.id}</span>
                </div>

                {item.similarityScore && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950/80 text-purple-300 border border-purple-800">
                    sim: {Math.round(item.similarityScore * 100)}%
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-200 font-mono leading-relaxed">{item.content}</p>

              {/* Tags and timestamp */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-[10px] font-mono text-slate-500">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <Tag className="w-3 h-3 text-slate-500" />
                  {item.metadata.tags.map(t => (
                    <span key={t} className="text-slate-400">#{t}</span>
                  ))}
                </div>
                <span>{item.metadata.createdAt ? new Date(item.metadata.createdAt).toLocaleTimeString() : 'Recent'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
