import React, { useState, useRef, useEffect } from 'react';
import { useSwarm } from '../context/SwarmContext';
import { 
  Terminal, 
  Trash2, 
  Download, 
  Send, 
  Search, 
  Filter,
  CheckCircle2,
  AlertTriangle,
  Info,
  Flame
} from 'lucide-react';

export const StreamingTerminal: React.FC = () => {
  const { 
    logs, 
    clearLogs, 
    addLog, 
    swarmState, 
    setTopology, 
    spawnAgent, 
    startMission, 
    createConsensusProposal,
    executeMcpTool,
    searchMemory
  } = useSwarm();

  const [filterSource, setFilterSource] = useState<string>('ALL');
  const [commandInput, setCommandInput] = useState<string>('');
  const [autoScroll, setAutoScroll] = useState<boolean>(true);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const sources = ['ALL', 'SWARM', 'QUEEN', 'AGENT', 'MCP', 'MEMORY', 'CONSENSUS', 'GOAP'];

  useEffect(() => {
    if (autoScroll && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, autoScroll]);

  const filteredLogs = logs.filter(log => {
    return filterSource === 'ALL' || log.source === filterSource;
  });

  const handleCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = commandInput.trim();
    if (!cmd) return;

    addLog('SWARM', 'info', `$ ${cmd}`);
    setCommandInput('');

    const parts = cmd.split(' ');
    const root = parts[0].toLowerCase();

    if (root === '/help') {
      addLog('SWARM', 'info', `Available CLI commands:
  /topology <mesh|hierarchical|centralized|ring>
  /spawn <name> <coder|architect|reviewer|tester|security-architect>
  /mission <goal text>
  /vote <proposal text>
  /mcp <tool_name> [json_payload]
  /memory <search query>
  /clear`);
    } else if (root === '/topology') {
      const top = parts[1] as any;
      if (['mesh', 'hierarchical', 'centralized', 'ring'].includes(top)) {
        setTopology(top);
      } else {
        addLog('SWARM', 'error', 'Usage: /topology <mesh|hierarchical|centralized|ring>');
      }
    } else if (root === '/spawn') {
      const name = parts[1] || 'Agent-Worker';
      const type = (parts[2] || 'coder') as any;
      spawnAgent(name, type);
    } else if (root === '/mission') {
      const goal = parts.slice(1).join(' ');
      if (goal) startMission(goal);
      else addLog('GOAP', 'error', 'Usage: /mission <describe goal>');
    } else if (root === '/vote') {
      const prop = parts.slice(1).join(' ');
      if (prop) createConsensusProposal(prop);
      else addLog('CONSENSUS', 'error', 'Usage: /vote <proposal text>');
    } else if (root === '/memory') {
      const q = parts.slice(1).join(' ');
      if (q) searchMemory(q);
      else addLog('MEMORY', 'error', 'Usage: /memory <query>');
    } else if (root === '/clear') {
      clearLogs();
    } else {
      addLog('SWARM', 'warn', `Unrecognized command: ${root}. Type /help for syntax.`);
    }
  };

  const getSourceBadge = (source: string) => {
    const map: Record<string, string> = {
      SWARM: 'bg-cyan-950 text-cyan-400 border-cyan-800',
      QUEEN: 'bg-purple-950 text-purple-300 border-purple-800',
      AGENT: 'bg-emerald-950 text-emerald-300 border-emerald-800',
      MCP: 'bg-blue-950 text-blue-300 border-blue-800',
      MEMORY: 'bg-indigo-950 text-indigo-300 border-indigo-800',
      CONSENSUS: 'bg-amber-950 text-amber-300 border-amber-800',
      GOAP: 'bg-pink-950 text-pink-300 border-pink-800',
    };
    return map[source] || 'bg-slate-800 text-slate-400 border-slate-700';
  };

  const getLevelColor = (level: string) => {
    if (level === 'error') return 'text-red-400 font-bold';
    if (level === 'warn') return 'text-amber-300';
    if (level === 'success') return 'text-emerald-300';
    return 'text-slate-200';
  };

  return (
    <div className="flex flex-col h-full bg-slate-950/90 rounded-2xl border border-slate-800 shadow-2xl p-4 overflow-hidden">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
        <div className="flex items-center space-x-2">
          <Terminal className="w-5 h-5 text-cyan-400" />
          <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wide">
            Live Swarm Event Bus & Console
          </h3>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
        </div>

        {/* Filter pills & controls */}
        <div className="flex items-center space-x-2 flex-wrap gap-1">
          <div className="flex bg-slate-900 rounded-lg p-0.5 border border-slate-800">
            {sources.map(s => (
              <button
                key={s}
                onClick={() => setFilterSource(s)}
                className={`text-[10px] px-2 py-0.5 rounded font-mono uppercase transition ${
                  filterSource === s
                    ? 'bg-cyan-500/20 text-cyan-300 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <button
            onClick={() => setAutoScroll(!autoScroll)}
            className={`text-[10px] px-2 py-1 rounded font-mono border ${
              autoScroll ? 'bg-slate-800 text-cyan-300 border-cyan-800' : 'bg-slate-900 text-slate-500 border-slate-800'
            }`}
          >
            Auto-Scroll: {autoScroll ? 'ON' : 'OFF'}
          </button>

          <button
            onClick={clearLogs}
            className="p-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800"
            title="Clear logs"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Terminal Output Area */}
      <div className="flex-1 overflow-y-auto font-mono text-xs p-3 space-y-1.5 my-2 bg-slate-950 rounded-xl border border-slate-900">
        {filteredLogs.length === 0 ? (
          <div className="text-slate-600 text-center py-12">
            No events recorded for current filter.
          </div>
        ) : (
          filteredLogs.map(log => (
            <div key={log.id} className="flex items-start space-x-2.5 leading-relaxed hover:bg-slate-900/40 p-1 rounded">
              <span className="text-slate-500 text-[10px] select-none">{log.timestamp}</span>
              <span className={`text-[9px] px-1.5 py-0.2 rounded border font-bold uppercase ${getSourceBadge(log.source)}`}>
                {log.source}
              </span>
              <span className={`flex-1 break-words ${getLevelColor(log.level)}`}>
                {log.text}
              </span>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* Interactive Command Input */}
      <form onSubmit={handleCommand} className="pt-2 flex items-center space-x-2">
        <span className="text-cyan-400 font-mono text-xs select-none">sentient-cli&gt;</span>
        <input
          type="text"
          value={commandInput}
          onChange={e => setCommandInput(e.target.value)}
          placeholder="Enter command (/help, /topology mesh, /spawn Coder coder, /mission <goal>, /vote <text>)..."
          className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-mono font-bold transition flex items-center space-x-1"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Send</span>
        </button>
      </form>
    </div>
  );
};
