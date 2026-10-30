import React, { useState } from 'react';
import { useSwarm } from '../context/SwarmContext';
import { AgentType } from '../types/swarm';
import { AVAILABLE_AGENT_PRESETS } from '../data/defaultAgents';
import { 
  Users, 
  UserPlus, 
  Trash2, 
  Vote, 
  ShieldCheck, 
  Activity, 
  CheckCircle2, 
  XCircle,
  Cpu,
  Layers,
  Sparkles
} from 'lucide-react';

export const SwarmCockpit: React.FC = () => {
  const { 
    swarmState, 
    spawnAgent, 
    terminateAgent, 
    createConsensusProposal, 
    voteConsensus,
    selectedAgent,
    setSelectedAgent
  } = useSwarm();

  const [isSpawnModalOpen, setIsSpawnModalOpen] = useState(false);
  const [newAgentName, setNewAgentName] = useState('');
  const [newAgentType, setNewAgentType] = useState<AgentType>('coder');
  const [proposalText, setProposalText] = useState('Approve Production Deployment of Sentient-UI v1.0');
  const [consensusAlgo, setConsensusAlgo] = useState<'raft' | 'byzantine' | 'gossip' | 'paxos'>('byzantine');

  const handleSpawn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAgentName.trim()) return;
    spawnAgent(newAgentName.trim(), newAgentType);
    setNewAgentName('');
    setIsSpawnModalOpen(false);
  };

  const handleTriggerProposal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proposalText.trim()) return;
    createConsensusProposal(proposalText.trim(), consensusAlgo);
  };

  return (
    <div className="flex flex-col lg:flex-row h-full gap-4 p-4">
      {/* Left Column: Fleet List & Spawner */}
      <div className="flex-1 flex flex-col bg-slate-950/90 rounded-2xl border border-slate-800 p-5 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wide flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan-400" />
              Active Swarm Agent Fleet ({swarmState.agents.length})
            </h3>
            <p className="text-xs text-slate-400 font-mono">Decoupled autonomous worker pools managed by QueenCoordinator</p>
          </div>

          <button
            onClick={() => setIsSpawnModalOpen(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono font-medium transition shadow-lg shadow-cyan-600/20"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Spawn Agent</span>
          </button>
        </div>

        {/* Agent Grid */}
        <div className="flex-1 overflow-y-auto space-y-2.5 py-4 pr-1">
          {swarmState.agents.map(agent => {
            const isQueen = agent.type === 'queen';
            const isSelected = selectedAgent?.id === agent.id;

            return (
              <div
                key={agent.id}
                onClick={() => setSelectedAgent(agent)}
                className={`p-3.5 rounded-xl border cursor-pointer transition ${
                  isSelected
                    ? 'bg-cyan-950/30 border-cyan-500/50 shadow-md shadow-cyan-500/10'
                    : 'bg-slate-900/60 hover:bg-slate-900 border-slate-800/80'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span
                      className="w-3.5 h-3.5 rounded-full"
                      style={{ backgroundColor: agent.color || '#38bdf8' }}
                    />
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        {agent.name}
                        {isQueen && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-800 font-mono">
                            👑 Leader
                          </span>
                        )}
                      </h4>
                      <p className="text-xs text-slate-400 font-mono">{agent.id} · [{agent.type}]</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="text-right font-mono text-[11px] hidden sm:block">
                      <span className="text-slate-400 block">Health: {agent.metrics.health}%</span>
                      <span className="text-slate-500">{agent.metrics.tasksCompleted} tasks</span>
                    </div>

                    <span className={`text-[10px] px-2 py-0.5 rounded font-mono uppercase font-semibold ${
                      agent.status === 'busy' ? 'bg-amber-950 text-amber-300' : 'bg-emerald-950 text-emerald-300'
                    }`}>
                      {agent.status}
                    </span>

                    {!isQueen && (
                      <button
                        onClick={(e) => { e.stopPropagation(); terminateAgent(agent.id); }}
                        className="p-1 rounded text-slate-500 hover:text-red-400 hover:bg-red-950/30 transition"
                        title="Terminate Agent"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Column: Distributed Consensus Quorum Ballot */}
      <div className="w-full lg:w-96 flex flex-col bg-slate-950/90 rounded-2xl border border-slate-800 p-5 shadow-2xl">
        <div className="flex items-center space-x-2 pb-3 border-b border-slate-800">
          <div className="p-2 rounded-lg bg-purple-950/80 border border-purple-800/80 text-purple-400">
            <Vote className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wide">Consensus Quorum</h3>
            <p className="text-[11px] text-slate-400">Byzantine Fault-Tolerant Voting Ledger</p>
          </div>
        </div>

        {/* Trigger Proposal Form */}
        <form onSubmit={handleTriggerProposal} className="space-y-3 my-4">
          <div>
            <label className="text-xs font-mono text-slate-400 block mb-1 uppercase">New Quorum Ballot</label>
            <input
              type="text"
              value={proposalText}
              onChange={e => setProposalText(e.target.value)}
              placeholder="State architectural action or policy..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 font-mono"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={consensusAlgo}
              onChange={e => setConsensusAlgo(e.target.value as any)}
              className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-purple-300 font-mono focus:outline-none"
            >
              <option value="byzantine">Byzantine (3f+1)</option>
              <option value="raft">Raft (Majority)</option>
              <option value="gossip">Gossip (Epidemic)</option>
              <option value="paxos">Paxos (Synod)</option>
            </select>

            <button
              type="submit"
              className="flex-1 py-1.5 px-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-mono font-semibold transition flex items-center justify-center space-x-1"
            >
              <Vote className="w-3.5 h-3.5" />
              <span>Call Vote</span>
            </button>
          </div>
        </form>

        {/* Active Proposals List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {swarmState.proposals.length === 0 ? (
            <p className="text-xs text-slate-500 font-mono text-center py-8">
              No voting ballots currently open. Call a proposal above to initiate distributed consensus.
            </p>
          ) : (
            swarmState.proposals.map(prop => {
              const yesCount = Object.values(prop.votes).filter(v => v.approve).length;
              const totalCount = Object.keys(prop.votes).length;
              const percent = Math.round((yesCount / prop.quorumNeeded) * 100);

              return (
                <div key={prop.id} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold bg-purple-950 text-purple-300 border border-purple-800">
                        {prop.algorithm}
                      </span>
                      <h4 className="text-xs font-bold text-white mt-1">{prop.proposal}</h4>
                    </div>

                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                      prop.status === 'accepted'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : prop.status === 'rejected'
                        ? 'bg-red-950 text-red-300 border border-red-800'
                        : 'bg-amber-950 text-amber-300 border border-amber-800'
                    }`}>
                      {prop.status}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-mono text-slate-400">
                      <span>Quorum Progress</span>
                      <span>{yesCount} / {prop.quorumNeeded} Needed ({percent}%)</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          prop.status === 'accepted' ? 'bg-emerald-400' : 'bg-purple-500'
                        }`}
                        style={{ width: `${Math.min(100, percent)}%` }}
                      />
                    </div>
                  </div>

                  {/* Voter Tally Pills */}
                  <div className="pt-2 border-t border-slate-800/80 flex flex-wrap gap-1">
                    {Object.entries(prop.votes).map(([voterId, vote]) => (
                      <span
                        key={voterId}
                        className={`text-[9px] font-mono px-1.5 py-0.5 rounded flex items-center gap-1 ${
                          vote.approve ? 'bg-emerald-950/80 text-emerald-300' : 'bg-red-950/80 text-red-300'
                        }`}
                      >
                        {vote.approve ? '✓' : '✗'} {voterId.replace('agent-', '')}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Spawn Agent Modal */}
      {isSpawnModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-slate-950 rounded-2xl border border-slate-800 p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-cyan-400" />
              Spawn Autonomous Agent
            </h3>
            <p className="text-xs text-slate-400 font-mono mb-4">
              Provision a specialized neural worker with isolated working memory.
            </p>

            <form onSubmit={handleSpawn} className="space-y-4">
              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1 uppercase">Preset Templates</label>
                <div className="grid grid-cols-2 gap-2">
                  {AVAILABLE_AGENT_PRESETS.slice(0, 6).map(preset => (
                    <button
                      type="button"
                      key={preset.name}
                      onClick={() => { setNewAgentName(preset.name); setNewAgentType(preset.type as any); }}
                      className={`text-left p-2 rounded-lg border text-xs font-mono transition ${
                        newAgentName === preset.name
                          ? 'bg-cyan-950/40 border-cyan-500 text-cyan-300'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <strong className="block text-white truncate">{preset.name}</strong>
                      <span className="text-[10px] text-slate-500">[{preset.type}]</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1 uppercase">Custom Agent Name</label>
                <input
                  type="text"
                  value={newAgentName}
                  onChange={e => setNewAgentName(e.target.value)}
                  placeholder="e.g. Cerberus-Guard"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1 uppercase">Specialization Type</label>
                <select
                  value={newAgentType}
                  onChange={e => setNewAgentType(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none"
                >
                  <option value="coder">coder (Code synthesis & test execution)</option>
                  <option value="architect">architect (System design & ADRs)</option>
                  <option value="reviewer">reviewer (AST diff & taste analysis)</option>
                  <option value="security-architect">security-architect (MCP audit & sandboxing)</option>
                  <option value="tester">tester (E2E simulation & regression tests)</option>
                  <option value="researcher">researcher (ArXiv & neural document retrieval)</option>
                  <option value="optimizer">optimizer (Latency & token compression)</option>
                  <option value="devops">devops (Docker & CI/CD deployment)</option>
                </select>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsSpawnModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-mono text-slate-400 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono font-bold transition shadow-lg shadow-cyan-600/20"
                >
                  Spawn to Swarm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
