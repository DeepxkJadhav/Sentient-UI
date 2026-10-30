import React, { useState } from 'react';
import { useSwarm } from '../context/SwarmContext';
import { 
  Compass, 
  Play, 
  RotateCcw, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  Cpu,
  Target
} from 'lucide-react';

export const GoapPlannerView: React.FC = () => {
  const { activeMission, startMission, executeNextMissionStep, replanMission } = useSwarm();
  const [goalInput, setGoalInput] = useState<string>('Build Sentient-UI Full-Stack Multi-Agent Swarm Platform');

  const presets = [
    'Build Sentient-UI Full-Stack Multi-Agent Swarm Platform',
    'Refactor Swarm Byzantine Consensus Quorum & Hot Failover',
    'Conduct Deep Security & Sandbox Escape Audit for 314+ MCP Tools'
  ];

  const handleStart = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!goalInput.trim()) return;
    startMission(goalInput.trim());
  };

  return (
    <div className="flex flex-col lg:flex-row h-full gap-4 p-4">
      {/* Left Column: Mission Configuration & World State Proposition Matrix */}
      <div className="w-full lg:w-96 flex flex-col gap-4">
        {/* Goal Creator Card */}
        <div className="bg-slate-950/90 rounded-2xl border border-slate-800 p-5 shadow-2xl">
          <div className="flex items-center space-x-2 mb-3">
            <div className="p-2 rounded-lg bg-cyan-950/80 border border-cyan-800/80 text-cyan-400">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wide">GOAP A* Engine</h3>
              <p className="text-[11px] text-slate-400">Goal-Oriented Action Planning Planner</p>
            </div>
          </div>

          <form onSubmit={handleStart} className="space-y-3">
            <div>
              <label className="text-xs font-mono text-slate-400 block mb-1.5 uppercase">Mission Objective</label>
              <textarea
                value={goalInput}
                onChange={e => setGoalInput(e.target.value)}
                rows={3}
                placeholder="Describe your desired target state..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono resize-none"
              />
            </div>

            {/* Presets */}
            <div className="space-y-1.5">
              <span className="text-[10px] uppercase font-mono text-slate-500 block">Quick Mission Presets</span>
              {presets.map((preset, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => { setGoalInput(preset); startMission(preset); }}
                  className="w-full text-left text-[11px] px-2.5 py-1.5 rounded-lg bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800/80 text-slate-300 font-mono transition truncate"
                >
                  ⚡ {preset}
                </button>
              ))}
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-2.5 px-4 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white rounded-xl text-xs font-semibold font-mono tracking-wide shadow-lg shadow-cyan-500/20 transition flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Synthesize A* Action Plan</span>
            </button>
          </form>
        </div>

        {/* World State Bitmask Matrix */}
        <div className="bg-slate-950/90 rounded-2xl border border-slate-800 p-5 shadow-2xl flex-1">
          <h4 className="text-xs font-bold text-slate-300 uppercase font-mono tracking-wide flex items-center gap-2 mb-3">
            <Target className="w-4 h-4 text-purple-400" />
            World State Bitmask Matrix
          </h4>

          {activeMission ? (
            <div className="space-y-2 font-mono text-xs">
              {Object.entries(activeMission.currentState).map(([fact, isSatisfied]) => (
                <div
                  key={fact}
                  className={`flex items-center justify-between p-2 rounded-lg border transition ${
                    isSatisfied
                      ? 'bg-emerald-950/30 border-emerald-800/40 text-emerald-300'
                      : 'bg-slate-900/40 border-slate-800/60 text-slate-500'
                  }`}
                >
                  <span className="truncate pr-2">{fact}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                    isSatisfied ? 'bg-emerald-900/80 text-emerald-300' : 'bg-slate-800 text-slate-500'
                  }`}>
                    {isSatisfied ? 'TRUE (1)' : 'FALSE (0)'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 font-mono text-center py-6">
              Initialize a GOAP mission to activate the world state evaluation matrix.
            </p>
          )}
        </div>
      </div>

      {/* Right Column: Execution Timeline & A* Plan DAG */}
      <div className="flex-1 flex flex-col bg-slate-950/90 rounded-2xl border border-slate-800 p-5 shadow-2xl">
        {activeMission ? (
          <div className="flex-1 flex flex-col">
            {/* Header / Mission Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 font-bold">
                  {activeMission.status.toUpperCase()}
                </span>
                <h3 className="text-base font-bold text-white mt-1">{activeMission.goal}</h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">{activeMission.id} · {activeMission.plan.length} A* search stages</p>
              </div>

              {/* Action Controls */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={replanMission}
                  className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-mono text-amber-300 transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Adaptive Replan</span>
                </button>

                <button
                  onClick={executeNextMissionStep}
                  disabled={activeMission.status === 'completed'}
                  className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold font-mono transition shadow-lg ${
                    activeMission.status === 'completed'
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20'
                  }`}
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Execute Step</span>
                </button>
              </div>
            </div>

            {/* Plan Action Cards */}
            <div className="flex-1 overflow-y-auto space-y-3 py-4 pr-1">
              {activeMission.plan.map((step, index) => {
                const isCurrent = step.status === 'in_progress';
                const isCompleted = step.status === 'completed';

                return (
                  <div
                    key={step.id}
                    className={`p-4 rounded-xl border transition-all ${
                      isCurrent
                        ? 'bg-cyan-950/30 border-cyan-500/60 shadow-lg shadow-cyan-500/10'
                        : isCompleted
                        ? 'bg-slate-900/50 border-slate-800/80 text-slate-300'
                        : 'bg-slate-900/20 border-slate-800/40 text-slate-500'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono text-xs font-bold ${
                          isCompleted
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : isCurrent
                            ? 'bg-cyan-950 text-cyan-400 border border-cyan-500 animate-pulse'
                            : 'bg-slate-800 text-slate-400'
                        }`}>
                          {isCompleted ? '✓' : step.order}
                        </span>

                        <div>
                          <h4 className="text-sm font-bold text-white flex items-center gap-2">
                            {step.action.name}
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                              Role: {step.action.assignedRole}
                            </span>
                            <span className="text-[10px] font-mono text-purple-400">
                              Cost: {step.action.cost}
                            </span>
                          </h4>
                          <p className="text-xs text-slate-400 mt-0.5">{step.action.description}</p>
                        </div>
                      </div>

                      <span className={`text-[10px] font-mono px-2.5 py-1 rounded-full uppercase font-semibold ${
                        isCompleted
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : isCurrent
                          ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {step.status}
                      </span>
                    </div>

                    {/* Preconditions & Effects */}
                    <div className="mt-3 pt-3 border-t border-slate-800/60 flex flex-wrap gap-4 text-[11px] font-mono">
                      <div>
                        <span className="text-slate-500 block mb-0.5 uppercase text-[9px]">Preconditions:</span>
                        <div className="flex flex-wrap gap-1">
                          {Object.keys(step.action.preconditions).length === 0 ? (
                            <span className="text-slate-500 italic">None (Root)</span>
                          ) : (
                            Object.keys(step.action.preconditions).map(pre => (
                              <span key={pre} className="px-1.5 py-0.5 rounded bg-slate-800/80 text-cyan-300">
                                {pre}
                              </span>
                            ))
                          )}
                        </div>
                      </div>

                      <div>
                        <span className="text-slate-500 block mb-0.5 uppercase text-[9px]">Effects Matrix:</span>
                        <div className="flex flex-wrap gap-1">
                          {Object.keys(step.action.effects).map(eff => (
                            <span key={eff} className="px-1.5 py-0.5 rounded bg-purple-950/60 border border-purple-800/40 text-purple-300">
                              +{eff}
                            </span>
                          ))}
                        </div>
                      </div>

                      {step.outputSummary && (
                        <div className="w-full mt-1 p-2 rounded bg-slate-950 border border-slate-800 text-emerald-400 text-[10px]">
                          {step.outputSummary}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-slate-500">
            <Compass className="w-12 h-12 mb-3 text-slate-600 stroke-[1.5]" />
            <h4 className="text-sm font-mono text-slate-300 font-bold mb-1">No Active Mission Loaded</h4>
            <p className="text-xs font-mono max-w-md">
              Enter an objective in the mission creator or click a preset to synthesize an A* Goal-Oriented Action Plan with automated agent delegation.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
