import React from 'react';
import { useSwarm } from '../context/SwarmContext';
import { TopologyType } from '../types/swarm';
import { 
  Network, 
  Cpu, 
  Compass, 
  Terminal, 
  Database, 
  Layers, 
  Activity,
  Zap,
  ShieldCheck
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const { swarmState, setTopology } = useSwarm();

  const topologies: { id: TopologyType; label: string }[] = [
    { id: 'hierarchical', label: 'Hierarchical' },
    { id: 'mesh', label: 'Mesh' },
    { id: 'centralized', label: 'Star / Central' },
    { id: 'ring', label: 'Ring' }
  ];

  const navItems = [
    { id: 'topology', label: 'Swarm Canvas', icon: Network },
    { id: 'goap', label: 'GOAP Planner', icon: Compass },
    { id: 'cockpit', label: 'Fleet Commander', icon: Cpu },
    { id: 'mcp', label: 'MCP Tools (314+)', icon: Layers },
    { id: 'memory', label: 'RuVector Memory', icon: Database },
    { id: 'telemetry', label: 'Neural Router', icon: Activity },
    { id: 'terminal', label: 'Live Console', icon: Terminal }
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#080c14]/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex items-center space-x-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 shadow-lg shadow-cyan-500/20">
              <Zap className="w-5 h-5 text-white animate-pulse" />
              <div className="absolute inset-0 rounded-xl border border-white/30"></div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-cyan-400 via-teal-300 to-purple-400 bg-clip-text text-transparent">
                  Sentient-UI
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-400 border border-cyan-800 font-mono font-medium">
                  v3.56 Sentient-UI
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" /> Byzantine Quorum Active
              </p>
            </div>
          </div>

          {/* Nav Tabs */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/10'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Quick Controls: Topology & Metrics */}
          <div className="flex items-center space-x-3">
            {/* Topology Picker */}
            <div className="hidden sm:flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs">
              {topologies.map(top => (
                <button
                  key={top.id}
                  onClick={() => setTopology(top.id)}
                  className={`px-2.5 py-1 rounded-md text-[11px] transition-all font-mono ${
                    swarmState.topology === top.id
                      ? 'bg-purple-600/30 text-purple-300 border border-purple-500/40 font-semibold'
                      : 'text-slate-400 hover:text-slate-300'
                  }`}
                >
                  {top.label}
                </button>
              ))}
            </div>

            {/* Live Token Burn & Latency */}
            <div className="flex items-center space-x-2 bg-slate-900/80 border border-slate-800/80 px-3 py-1.5 rounded-lg text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="text-slate-400">Agents:</span>
              <span className="text-cyan-400 font-bold">{swarmState.agents.length}</span>
              <span className="text-slate-600">|</span>
              <span className="text-slate-400">{swarmState.metrics.avgLatencyMs}ms</span>
            </div>
          </div>
        </div>

        {/* Mobile Tab Navigation */}
        <div className="flex lg:hidden overflow-x-auto py-2 space-x-1 border-t border-slate-800/60">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs whitespace-nowrap ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-medium'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
