import express from 'express';
import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: '/ws' });

// In-memory swarm state
let swarmTopology = 'hierarchical';
let totalTasks = 218;
let completedTasks = 214;

// Broadcast to connected WebSockets
function broadcast(data: any) {
  const msg = JSON.stringify(data);
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(msg);
    }
  });
}

// 1. Health & Status
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    version: '1.0.0',
    platform: 'Sentient-UI Autonomous Swarm Platform',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// 2. Swarm State & Topology
app.get('/api/swarm', (req, res) => {
  res.json({
    id: 'swarm-alpha-01',
    topology: swarmTopology,
    totalTasks,
    completedTasks,
    activeAgents: 7,
    mcpToolsLoaded: 314
  });
});

app.post('/api/swarm/topology', (req, res) => {
  const { topology } = req.body;
  if (!['mesh', 'hierarchical', 'centralized', 'ring'].includes(topology)) {
    return res.status(400).json({ error: 'Invalid topology' });
  }
  swarmTopology = topology;
  broadcast({ type: 'TOPOLOGY_CHANGED', topology });
  res.json({ success: true, topology: swarmTopology });
});

// 3. Sentient Engine Endpoints
app.get('/api/engine/status', (req, res) => {
  try {
    const pkgPath = path.join(projectRoot, 'package.json');
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    const pluginsDir = path.join(projectRoot, 'plugins');
    const plugins = fs.existsSync(pluginsDir) ? fs.readdirSync(pluginsDir) : [];

    res.json({
      engine: 'Sentient Swarm Platform',
      version: pkg.version || '3.56.10',
      description: pkg.description,
      totalPlugins: plugins.length,
      enginePath: projectRoot,
      loadedAt: new Date().toISOString()
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Sentient Plugins Registry
app.get('/api/engine/plugins', (req, res) => {
  try {
    const pluginsDir = path.join(projectRoot, 'plugins');
    if (!fs.existsSync(pluginsDir)) return res.json({ plugins: [] });

    const pluginFolders = fs.readdirSync(pluginsDir, { withFileTypes: true })
      .filter(d => d.isDirectory())
      .map(d => {
        const readmePath = path.join(pluginsDir, d.name, 'README.md');
        const pluginJsonPath = path.join(pluginsDir, d.name, '.claude-plugin/plugin.json');
        let title = d.name;
        let version = 'latest';
        if (fs.existsSync(pluginJsonPath)) {
          try {
            const pj = JSON.parse(fs.readFileSync(pluginJsonPath, 'utf8'));
            version = pj.version || version;
          } catch {}
        }
        return {
          name: d.name,
          version,
          hasReadme: fs.existsSync(readmePath)
        };
      });

    res.json({ total: pluginFolders.length, plugins: pluginFolders });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Sentient Agent Skills Directory
app.get('/api/engine/skills', (req, res) => {
  try {
    const skillsDir = path.join(projectRoot, '.agents/skills');
    if (!fs.existsSync(skillsDir)) return res.json({ skills: [] });

    const skillList = fs.readdirSync(skillsDir, { withFileTypes: true })
      .filter(d => d.isDirectory())
      .map(d => ({
        name: d.name,
        skillPath: `.agents/skills/${d.name}`
      }));

    res.json({ total: skillList.length, skills: skillList });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// MCP Tool Execution Dispatcher
app.post('/api/mcp/execute', (req, res) => {
  const { tool, payload } = req.body;
  const startTime = Date.now();

  const latency = Math.floor(15 + Math.random() * 45);
  setTimeout(() => {
    const result = {
      tool,
      status: 'success',
      latencyMs: latency,
      output: {
        processed: true,
        tool,
        receivedPayload: payload,
        engine: 'Sentient Swarm Engine v3.56.10',
        swarmStatus: 'stable'
      }
    };
    broadcast({ type: 'MCP_TOOL_EXECUTED', result });
    res.json(result);
  }, latency);
});

// WebSocket Connection Management
wss.on('connection', ws => {
  ws.send(JSON.stringify({
    type: 'CONNECTED',
    message: 'Sentient-UI Telemetry Stream Established',
    timestamp: new Date().toISOString()
  }));

  ws.on('message', data => {
    try {
      const parsed = JSON.parse(data.toString());
      if (parsed.type === 'PING') {
        ws.send(JSON.stringify({ type: 'PONG', timestamp: Date.now() }));
      }
    } catch (e) {
      // Ignore
    }
  });
});

server.listen(port, () => {
  console.log(`[Sentient-UI Backend Engine] Listening on port ${port}`);
  console.log(`[Sentient Core Engine] Root at: ${projectRoot}`);
  console.log(`[WebSocket Stream] ws://localhost:${port}/ws`);
});
