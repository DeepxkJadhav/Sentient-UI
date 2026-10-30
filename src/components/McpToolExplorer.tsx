import React, { useState } from 'react';
import { useSwarm } from '../context/SwarmContext';
import { McpTool } from '../types/mcp';
import { 
  Layers, 
  Search, 
  Play, 
  Terminal, 
  CheckCircle2, 
  Clock, 
  Code,
  Sparkles,
  Zap
} from 'lucide-react';

export const McpToolExplorer: React.FC = () => {
  const { mcpTools, executeMcpTool, lastMcpResult } = useSwarm();
  const [selectedTool, setSelectedTool] = useState<McpTool>(mcpTools[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNamespace, setSelectedNamespace] = useState<string>('all');
  const [payloadText, setPayloadText] = useState<string>(
    JSON.stringify(mcpTools[0]?.samplePayload || {}, null, 2)
  );
  const [isExecuting, setIsExecuting] = useState(false);

  const namespaces = ['all', 'swarm', 'agent', 'memory', 'intelligence', 'task', 'hooks'];

  const filteredTools = mcpTools.filter(tool => {
    const matchesNamespace = selectedNamespace === 'all' || tool.namespace === selectedNamespace;
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesNamespace && matchesSearch;
  });

  const handleSelectTool = (tool: McpTool) => {
    setSelectedTool(tool);
    setPayloadText(JSON.stringify(tool.samplePayload || {}, null, 2));
  };

  const handleRun = async () => {
    try {
      setIsExecuting(true);
      const parsed = JSON.parse(payloadText);
      await executeMcpTool(selectedTool.name, parsed);
    } catch (e: any) {
      alert(`Invalid JSON payload: ${e.message}`);
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-full gap-4 p-4">
      {/* Left Column: Tool Catalog Browser */}
      <div className="w-full lg:w-96 flex flex-col bg-slate-950/90 rounded-2xl border border-slate-800 p-5 shadow-2xl">
        <div className="flex items-center space-x-2 pb-3 border-b border-slate-800">
          <div className="p-2 rounded-lg bg-cyan-950/80 border border-cyan-800/80 text-cyan-400">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wide">
              Sentient MCP Registry (314+)
            </h3>
            <p className="text-[11px] text-slate-400">Model Context Protocol Endpoints</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative my-3">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search tools..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
          />
        </div>

        {/* Namespace Filter Pills */}
        <div className="flex flex-wrap gap-1 mb-3">
          {namespaces.map(ns => (
            <button
              key={ns}
              onClick={() => setSelectedNamespace(ns)}
              className={`text-[10px] px-2 py-0.5 rounded-md font-mono uppercase transition ${
                selectedNamespace === ns
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {ns}
            </button>
          ))}
        </div>

        {/* Tool List */}
        <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
          {filteredTools.map(tool => {
            const isSelected = selectedTool?.name === tool.name;
            return (
              <button
                key={tool.name}
                onClick={() => handleSelectTool(tool)}
                className={`w-full text-left p-2.5 rounded-xl border transition ${
                  isSelected
                    ? 'bg-cyan-950/40 border-cyan-500 text-cyan-300 shadow-sm shadow-cyan-500/10'
                    : 'bg-slate-900/60 hover:bg-slate-900 border-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold truncate">{tool.name}</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono uppercase">
                    {tool.namespace}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{tool.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right Column: Tool Schema & Interactive Invocation Console */}
      <div className="flex-1 flex flex-col bg-slate-950/90 rounded-2xl border border-slate-800 p-5 shadow-2xl">
        {selectedTool ? (
          <div className="flex-1 flex flex-col space-y-4">
            {/* Tool Header */}
            <div className="flex items-start justify-between pb-3 border-b border-slate-800">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 font-mono uppercase">
                    {selectedTool.namespace}
                  </span>
                  <h3 className="text-base font-bold text-white font-mono">{selectedTool.name}</h3>
                </div>
                <p className="text-xs text-slate-400 mt-1">{selectedTool.description}</p>
              </div>

              <button
                onClick={handleRun}
                disabled={isExecuting}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white text-xs font-bold font-mono transition shadow-lg shadow-cyan-500/20"
              >
                <Zap className="w-4 h-4" />
                <span>{isExecuting ? 'Dispatching...' : 'Execute Tool'}</span>
              </button>
            </div>

            {/* Parameter Schema Table */}
            <div>
              <h4 className="text-xs font-mono text-slate-400 uppercase mb-2">Parameters Schema</h4>
              <div className="overflow-x-auto rounded-xl border border-slate-800">
                <table className="w-full text-left font-mono text-xs">
                  <thead className="bg-slate-900 text-slate-400 text-[10px] uppercase">
                    <tr>
                      <th className="p-2.5">Field</th>
                      <th className="p-2.5">Type</th>
                      <th className="p-2.5">Required</th>
                      <th className="p-2.5">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 bg-slate-950/60">
                    {selectedTool.parameters.map(param => (
                      <tr key={param.name}>
                        <td className="p-2.5 font-bold text-cyan-300">{param.name}</td>
                        <td className="p-2.5 text-slate-400">{param.type}</td>
                        <td className="p-2.5">
                          {param.required ? (
                            <span className="text-red-400 font-bold">YES</span>
                          ) : (
                            <span className="text-slate-500">NO</span>
                          )}
                        </td>
                        <td className="p-2.5 text-slate-300">{param.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Payload JSON Editor */}
            <div className="flex-1 flex flex-col">
              <label className="text-xs font-mono text-slate-400 uppercase mb-1">
                Execution Payload (JSON)
              </label>
              <textarea
                value={payloadText}
                onChange={e => setPayloadText(e.target.value)}
                rows={6}
                className="w-full flex-1 bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-cyan-300 font-mono focus:outline-none focus:border-cyan-500 resize-none"
              />
            </div>

            {/* Last Execution Output */}
            {lastMcpResult && (
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5 font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    Response from {lastMcpResult.toolName} ({lastMcpResult.executionTimeMs}ms)
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">{lastMcpResult.timestamp}</span>
                </div>
                <pre className="bg-slate-950 p-3 rounded-lg text-xs font-mono text-slate-300 overflow-x-auto max-h-40 border border-slate-800">
                  {JSON.stringify(lastMcpResult.output, null, 2)}
                </pre>
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-slate-500">
            <Layers className="w-12 h-12 mb-3 text-slate-600" />
            <p className="text-xs font-mono">Select a tool from the catalog to inspect its schema and test execution.</p>
          </div>
        )}
      </div>
    </div>
  );
};
