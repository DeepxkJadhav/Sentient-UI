import React, { useRef, useEffect, useState } from 'react';
import { useSwarm } from '../context/SwarmContext';
import { AgentNode } from '../types/swarm';
import { 
  Play, 
  RefreshCw, 
  CheckCircle2, 
  Cpu, 
  ShieldAlert, 
  Maximize2,
  Minimize2,
  Radio,
  Sliders,
  Send
} from 'lucide-react';

export const TopologyCanvas: React.FC = () => {
  const { swarmState, setTopology, selectedAgent, setSelectedAgent, addLog } = useSwarm();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [draggedNode, setDraggedNode] = useState<AgentNode | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [packetProgress, setPacketProgress] = useState<number>(0);
  const [delegatedInstruction, setDelegatedInstruction] = useState<string>('');

  // Animation loop for packets and glowing pulses
  useEffect(() => {
    let animId: number;
    let progress = 0;

    const animate = () => {
      progress = (progress + 0.012) % 1;
      setPacketProgress(progress);
      renderCanvas(progress);
      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [swarmState, selectedAgent]);

  const renderCanvas = (prog: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;

    // Clear background with deep space grid
    ctx.fillStyle = '#080c14';
    ctx.fillRect(0, 0, width, height);

    // Draw subtle grid
    ctx.strokeStyle = 'rgba(30, 41, 59, 0.4)';
    ctx.lineWidth = 1;
    const gridSize = 40;
    for (let x = 0; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    const { agents, links } = swarmState;
    const agentMap = new Map<string, AgentNode>();
    agents.forEach(a => agentMap.set(a.id, a));

    // 1. Draw Links
    links.forEach(link => {
      const fromNode = agentMap.get(link.from);
      const toNode = agentMap.get(link.to);
      if (!fromNode || !toNode || fromNode.x === undefined || fromNode.y === undefined || toNode.x === undefined || toNode.y === undefined) return;

      const isConnectedToSelected = selectedAgent && (selectedAgent.id === fromNode.id || selectedAgent.id === toNode.id);

      // Link line
      ctx.beginPath();
      ctx.moveTo(fromNode.x, fromNode.y);
      ctx.lineTo(toNode.x, toNode.y);
      ctx.strokeStyle = isConnectedToSelected ? 'rgba(6, 182, 212, 0.7)' : 'rgba(56, 189, 248, 0.2)';
      ctx.lineWidth = isConnectedToSelected ? 2.5 : 1.2;
      ctx.stroke();

      // Communication packet traveling along link
      const packetX = fromNode.x + (toNode.x - fromNode.x) * prog;
      const packetY = fromNode.y + (toNode.y - fromNode.y) * prog;

      ctx.save();
      ctx.beginPath();
      ctx.arc(packetX, packetY, isConnectedToSelected ? 4 : 2.5, 0, 2 * Math.PI);
      ctx.fillStyle = isConnectedToSelected ? '#38bdf8' : '#a855f7';
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.restore();
    });

    // 2. Draw Nodes
    agents.forEach(agent => {
      if (agent.x === undefined || agent.y === undefined) return;
      const isSelected = selectedAgent?.id === agent.id;
      const isQueen = agent.type === 'queen';
      const radius = isQueen ? 28 : 22;

      // Glow effect for selected or Queen
      ctx.save();
      if (isSelected || isQueen) {
        ctx.beginPath();
        ctx.arc(agent.x, agent.y, radius + (Math.sin(prog * Math.PI * 4) * 3 + 6), 0, 2 * Math.PI);
        ctx.strokeStyle = isQueen ? 'rgba(168, 85, 247, 0.4)' : 'rgba(6, 182, 212, 0.4)';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Outer border
      ctx.beginPath();
      ctx.arc(agent.x, agent.y, radius + 2, 0, 2 * Math.PI);
      ctx.strokeStyle = isSelected ? '#38bdf8' : 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = isSelected ? 3 : 1.5;
      ctx.stroke();

      // Node body
      ctx.beginPath();
      ctx.arc(agent.x, agent.y, radius, 0, 2 * Math.PI);
      ctx.fillStyle = agent.color || '#38bdf8';
      ctx.shadowColor = agent.color || '#38bdf8';
      ctx.shadowBlur = isSelected ? 15 : 6;
      ctx.fill();
      ctx.restore();

      // Inner icon or initial letter
      ctx.fillStyle = '#ffffff';
      ctx.font = `bold ${isQueen ? '14px' : '11px'} Inter, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const label = isQueen ? '👑' : agent.type.slice(0, 2).toUpperCase();
      ctx.fillText(label, agent.x, agent.y);

      // Label below node
      ctx.font = '600 12px Inter, sans-serif';
      ctx.fillStyle = isSelected ? '#38bdf8' : '#e2e8f0';
      ctx.textAlign = 'center';
      ctx.fillText(agent.name, agent.x, agent.y + radius + 16);

      // Role tag below name
      ctx.font = '10px Fira Code, monospace';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText(`[${agent.type}]`, agent.x, agent.y + radius + 28);

      // Status indicator pip
      ctx.beginPath();
      ctx.arc(agent.x + radius - 4, agent.y - radius + 4, 5, 0, 2 * Math.PI);
      ctx.fillStyle = agent.status === 'busy' ? '#f59e0b' : agent.status === 'error' ? '#ef4444' : '#10b981';
      ctx.fill();
    });
  };

  // Mouse interaction: Node selection and dragging
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const clicked = swarmState.agents.find(a => {
      if (a.x === undefined || a.y === undefined) return false;
      const dx = a.x - x;
      const dy = a.y - y;
      return Math.sqrt(dx * dx + dy * dy) <= 30;
    });

    if (clicked) {
      setSelectedAgent(clicked);
      setDraggedNode(clicked);
      setDragOffset({ x: clicked.x! - x, y: clicked.y! - y });
    } else {
      setSelectedAgent(null);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!draggedNode || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    draggedNode.x = Math.max(40, Math.min(rect.width - 40, x + dragOffset.x));
    draggedNode.y = Math.max(40, Math.min(rect.height - 40, y + dragOffset.y));
  };

  const handleMouseUp = () => {
    setDraggedNode(null);
  };

  const handleDelegate = () => {
    if (!selectedAgent || !delegatedInstruction.trim()) return;
    addLog('QUEEN', 'info', `Queen instructed [${selectedAgent.name}]: "${delegatedInstruction}"`);
    selectedAgent.status = 'busy';
    selectedAgent.currentTask = delegatedInstruction;
    setDelegatedInstruction('');
    setTimeout(() => {
      selectedAgent.status = 'idle';
      selectedAgent.currentTask = undefined;
      selectedAgent.metrics.tasksCompleted += 1;
      addLog('AGENT', 'success', `[${selectedAgent.name}] finished instruction successfully.`);
    }, 2000);
  };

  return (
    <div className="flex flex-col lg:flex-row h-full w-full gap-4 p-4">
      {/* Canvas Area */}
      <div className="flex-1 flex flex-col bg-slate-950/80 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden relative" ref={containerRef}>
        {/* Canvas Toolbar */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-900/60 border-b border-slate-800/80">
          <div className="flex items-center space-x-3">
            <span className="flex items-center gap-1.5 text-xs font-mono text-cyan-400">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              Live Swarm Topology: <strong className="text-white uppercase">{swarmState.topology}</strong>
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-xs text-slate-400 font-mono">
              Nodes: <span className="text-white">{swarmState.agents.length}</span> · Links: <span className="text-white">{swarmState.links.length}</span>
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setTopology(swarmState.topology === 'mesh' ? 'hierarchical' : swarmState.topology === 'hierarchical' ? 'centralized' : swarmState.topology === 'centralized' ? 'ring' : 'mesh')}
              className="flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-mono transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Morph Layout</span>
            </button>
          </div>
        </div>

        {/* Interactive Canvas */}
        <div className="flex-1 relative cursor-crosshair min-h-[460px]">
          <canvas
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            className="w-full h-full block"
          />

          {/* Quick instructions overlay */}
          <div className="absolute bottom-3 left-4 pointer-events-none text-[11px] text-slate-500 font-mono bg-slate-950/80 px-2.5 py-1 rounded border border-slate-800/60 backdrop-blur-sm">
            Click node to inspect · Drag to reposition in vector space
          </div>
        </div>
      </div>

      {/* Selected Agent Inspector Drawer */}
      <div className="w-full lg:w-96 flex flex-col bg-slate-950/90 rounded-2xl border border-slate-800 p-5 shadow-2xl">
        <h3 className="text-sm font-semibold tracking-wide text-slate-300 uppercase font-mono flex items-center gap-2 mb-4">
          <Cpu className="w-4 h-4 text-cyan-400" />
          Agent Inspector
        </h3>

        {selectedAgent ? (
          <div className="space-y-4">
            {/* Header info */}
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    {selectedAgent.name}
                    {selectedAgent.type === 'queen' && <span className="text-xs px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-800">Queen</span>}
                  </h4>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">{selectedAgent.id}</p>
                </div>
                <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-mono uppercase font-semibold ${
                  selectedAgent.status === 'busy' ? 'bg-amber-950 text-amber-300 border border-amber-800' : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                }`}>
                  {selectedAgent.status}
                </span>
              </div>

              {selectedAgent.currentTask && (
                <div className="mt-3 p-2.5 rounded-lg bg-cyan-950/40 border border-cyan-800/40 text-xs text-cyan-300 font-mono">
                  <span className="text-cyan-400 font-semibold block mb-0.5">Active Execution:</span>
                  {selectedAgent.currentTask}
                </div>
              )}
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800/80">
                <span className="text-slate-400 block text-[10px] uppercase">Tasks Done</span>
                <span className="text-lg font-bold text-white">{selectedAgent.metrics.tasksCompleted}</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800/80">
                <span className="text-slate-400 block text-[10px] uppercase">Success Rate</span>
                <span className="text-lg font-bold text-emerald-400">{selectedAgent.metrics.successRate}%</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800/80">
                <span className="text-slate-400 block text-[10px] uppercase">CPU Load</span>
                <span className="text-lg font-bold text-cyan-400">{selectedAgent.metrics.cpuUsage}%</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800/80">
                <span className="text-slate-400 block text-[10px] uppercase">Latency</span>
                <span className="text-lg font-bold text-purple-400">{selectedAgent.metrics.responseTimeMs}ms</span>
              </div>
            </div>

            {/* Capabilities */}
            <div>
              <span className="text-xs font-mono text-slate-400 block mb-1.5 uppercase">Registered Capabilities</span>
              <div className="flex flex-wrap gap-1.5">
                {selectedAgent.capabilities.map((cap, i) => (
                  <span key={i} className="text-[11px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 font-mono">
                    {cap}
                  </span>
                ))}
              </div>
            </div>

            {/* Direct Queen Delegation Box */}
            <div className="pt-2 border-t border-slate-800">
              <span className="text-xs font-mono text-slate-400 block mb-1.5 uppercase">Queen Direct Delegation</span>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={delegatedInstruction}
                  onChange={e => setDelegatedInstruction(e.target.value)}
                  placeholder={`Instruct ${selectedAgent.name}...`}
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
                  onKeyDown={e => e.key === 'Enter' && handleDelegate()}
                />
                <button
                  onClick={handleDelegate}
                  className="px-3 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-medium transition flex items-center"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-slate-500">
            <Radio className="w-10 h-10 mb-2 stroke-[1.5] text-slate-600" />
            <p className="text-xs font-mono">Select any agent node on the canvas to inspect real-time metrics, telemetry, and capabilities.</p>
          </div>
        )}
      </div>
    </div>
  );
};
