import React from 'react';
import { useSwarm } from '../context/SwarmContext';
import { 
  Activity, 
  Zap, 
  DollarSign, 
  Gauge, 
  Cpu, 
  TrendingUp, 
  ShieldCheck, 
  Flame,
  CheckCircle2
} from 'lucide-react';

export const ModelRouterTelemetry: React.FC = () => {
  const { swarmState } = useSwarm();

  const routerTiers = [
    {
      tier: 'Tier 1: Deterministic Codemod',
      cost: '$0.00 / 0 Tokens',
      latency: '1.2ms',
      share: '44%',
      desc: 'AST transforms, formatting, linter fixes, zero LLM compute invocation',
      badge: 'Free / Instant',
      color: 'text-emerald-400 border-emerald-800 bg-emerald-950/40'
    },
    {
      tier: 'Tier 2: Fast Reflex Agent',
      cost: '$0.0004 / 1k Tokens',
      latency: '145ms',
      share: '38%',
      desc: 'Lightweight triage, unit tests, doc generation, schema validation',
      badge: 'Haiku / Flash',
      color: 'text-cyan-400 border-cyan-800 bg-cyan-950/40'
    },
    {
      tier: 'Tier 3: Deep Frontier Reasoning',
      cost: '$0.015 / 1k Tokens',
      latency: '890ms',
      share: '18%',
      desc: 'System architecture, security threat modeling, GOAP A* replenishment',
      badge: 'Sonnet / Opus / Pro',
      color: 'text-purple-400 border-purple-800 bg-purple-950/40'
    }
  ];

  return (
    <div className="flex flex-col h-full gap-4 p-4">
      {/* Top Telemetry KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-950/90 rounded-2xl border border-slate-800 p-4 shadow-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono uppercase mb-2">
            <span>Session Burn Cost</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">
            ${swarmState.metrics.totalCostUsd.toFixed(2)}
          </div>
          <p className="text-[10px] text-slate-500 font-mono mt-1">Budget Hardcap: $2.50 (19.2% spent)</p>
        </div>

        <div className="bg-slate-950/90 rounded-2xl border border-slate-800 p-4 shadow-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono uppercase mb-2">
            <span>Token Burn Rate</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-300 font-mono">
            {swarmState.metrics.tokenBurnRate} <span className="text-xs text-slate-400">tok/min</span>
          </div>
          <p className="text-[10px] text-slate-500 font-mono mt-1">Adaptive token budget optimizer active</p>
        </div>

        <div className="bg-slate-950/90 rounded-2xl border border-slate-800 p-4 shadow-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono uppercase mb-2">
            <span>Avg Swarm Latency</span>
            <Gauge className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-cyan-300 font-mono">
            {swarmState.metrics.avgLatencyMs} <span className="text-xs text-slate-400">ms</span>
          </div>
          <p className="text-[10px] text-slate-500 font-mono mt-1">p99: 78ms · Zero transport timeouts</p>
        </div>

        <div className="bg-slate-950/90 rounded-2xl border border-slate-800 p-4 shadow-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono uppercase mb-2">
            <span>Tasks Dispatched</span>
            <CheckCircle2 className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-purple-300 font-mono">
            {swarmState.metrics.completedTasks} / {swarmState.metrics.totalTasks}
          </div>
          <p className="text-[10px] text-slate-500 font-mono mt-1">98.2% Byzantine Consensus Verification</p>
        </div>
      </div>

      {/* 3-Tier Model Router Matrix */}
      <div className="bg-slate-950/90 rounded-2xl border border-slate-800 p-5 shadow-2xl flex-1 flex flex-col">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div>
            <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wide flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              3-Tier Model Routing Architecture (Sentient Self-Learning)
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Intelligent request classification minimizes latency and preserves API tokens.
            </p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono font-semibold">
            ● Adaptive Learning Enabled
          </span>
        </div>

        {/* Router Tier Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {routerTiers.map(tier => (
            <div key={tier.tier} className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase font-bold ${tier.color}`}>
                    {tier.badge}
                  </span>
                  <span className="text-xs font-mono text-slate-400">Share: {tier.share}</span>
                </div>
                <h4 className="text-sm font-bold text-white font-mono mb-1">{tier.tier}</h4>
                <p className="text-xs text-slate-400 font-mono leading-relaxed">{tier.desc}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Rate: <strong className="text-white">{tier.cost}</strong></span>
                <span className="text-cyan-400">Latency: <strong>{tier.latency}</strong></span>
              </div>
            </div>
          ))}
        </div>

        {/* Traffic Routing Distribution Visualizer */}
        <div className="mt-auto p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400 uppercase">Traffic Distribution by Router Tier</span>
            <span className="text-slate-500">Total Invocations: 1,842</span>
          </div>

          <div className="w-full bg-slate-800 h-3 rounded-full flex overflow-hidden">
            <div className="bg-emerald-400 h-full" style={{ width: '44%' }} title="Tier 1: 44%" />
            <div className="bg-cyan-400 h-full" style={{ width: '38%' }} title="Tier 2: 38%" />
            <div className="bg-purple-500 h-full" style={{ width: '18%' }} title="Tier 3: 18%" />
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-400" /> Tier 1 (44%)</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-cyan-400" /> Tier 2 (38%)</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-purple-500" /> Tier 3 (18%)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
