import React, { useState } from 'react';
import { SwarmProvider } from './context/SwarmContext';
import { Navbar } from './components/Navbar';
import { TopologyCanvas } from './components/TopologyCanvas';
import { GoapPlannerView } from './components/GoapPlannerView';
import { SwarmCockpit } from './components/SwarmCockpit';
import { McpToolExplorer } from './components/McpToolExplorer';
import { MemoryExplorer } from './components/MemoryExplorer';
import { ModelRouterTelemetry } from './components/ModelRouterTelemetry';
import { StreamingTerminal } from './components/StreamingTerminal';
import { ShieldCheck, Database, Radio, GitBranch } from 'lucide-react';

export const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('topology');

  return (
    <div className="min-h-screen flex flex-col bg-[#080c14] text-slate-100 font-sans selection:bg-cyan-500 selection:text-black">
      {/* Top Navigation */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-2 sm:p-4 flex flex-col min-h-0">
        {activeTab === 'topology' && <TopologyCanvas />}
        {activeTab === 'goap' && <GoapPlannerView />}
        {activeTab === 'cockpit' && <SwarmCockpit />}
        {activeTab === 'mcp' && <McpToolExplorer />}
        {activeTab === 'memory' && <MemoryExplorer />}
        {activeTab === 'telemetry' && <ModelRouterTelemetry />}
        {activeTab === 'terminal' && <StreamingTerminal />}
      </main>

      {/* Persistent Status Bar */}
      <footer className="border-t border-slate-800/80 bg-slate-950/80 backdrop-blur px-4 py-2 text-[11px] font-mono text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-4">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Sentient Gateway: CONNECTED
            </span>
            <span className="flex items-center gap-1 text-cyan-400">
              <Database className="w-3 h-3" /> SentientDB HNSW: SYNCED
            </span>
            <span className="flex items-center gap-1 text-purple-400">
              <ShieldCheck className="w-3 h-3" /> Byzantine Fault Gate: 3f+1 OK
            </span>
          </div>

          <div className="flex items-center space-x-3 text-slate-500">
            <span>Branch: main</span>
            <span className="text-cyan-400 font-bold">Sentient-UI Engine</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <SwarmProvider>
      <AppContent />
    </SwarmProvider>
  );
};

export default App;
