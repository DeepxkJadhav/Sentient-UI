# Sentient-UI — Autonomous Multi-Agent Guide

> **Sentient-UI**: Autonomous Multi-Agent Swarm Orchestrator & Neural Cockpit  
> Standard: Agentic Swarm & Byzantine Fault-Tolerant Consensus  
> Maintainer: [Deepxk Jadhav](https://github.com/DeepxkJadhav)  

---

## 📢 Core Principles

```
╔═══════════════════════════════════════════════════════════════════════════╗
║  1. Sentient-UI = Visual Mission Control Plane & Orchestrator             ║
║  2. Agents = Autonomous Neural Workers (Coder, Tester, Architect, etc.)   ║
║  3. GOAP Solver = Finds the optimal A* execution plan to reach goals      ║
║  4. Consensus = Byzantine (3f+1), Raft, Paxos, Gossip Quorum Verification  ║
║  5. MCP Tools = 314+ extensible protocol tools for memory, tasks, & hooks ║
╚═══════════════════════════════════════════════════════════════════════════╝
```

---

## 🛸 Swarm Topologies

Sentient-UI provides four distinct operational topologies:

| Topology | Use Case | Dynamics |
|----------|----------|----------|
| **Hierarchical** | Structured teams with Queen/Lead delegation | Strict parent-child routing; anti-drift coordination |
| **Mesh** | Peer-to-peer collaborative problem solving | All-to-all bi-directional communication channels |
| **Star** | Centralized hub for high-throughput dispatch | Queen at center, radial worker spokes |
| **Ring** | Sequential pipelines and iterative handoffs | Ordered circular token-passing |

---

## 🧭 GOAP (Goal-Oriented Action Planning) Workflow

The planner uses an $A^*$ graph search to formulate an action plan:
1. **World State Evaluation**: Checks boolean conditions (`goalDefined`, `architectureValidated`, `codeGenerated`, `testsPassing`, etc.).
2. **Action Preconditions & Effects**: Each registered action transitions the world state bitmask.
3. **Execution Loop**: Workers execute sequential plan steps, updating world states in real time.
4. **Adaptive Replanning**: If an unexpected environment failure occurs, the planner recomputes from the latest state.

---

## 🛡️ Byzantine Consensus Protocols

When critical operations occur (deployments, architectural promotions, destructive migrations), agents cast cryptographic ballots:
- **Byzantine Fault Tolerance ($3f+1$)**: Requires $\ge 67\%$ supermajority to withstand malicious or faulty agents.
- **Raft Consensus**: Standard majority ($> 50\%$) leader election and log replication.
- **Paxos**: Quorum-based distributed agreement.
- **Gossip**: Probabilistic eventual consistency across mesh networks.

---

## 🔌 MCP Integration

Sentient-UI integrates 314+ Model Context Protocol (MCP) tools across key namespaces:
- `swarm_*`: Swarm lifecycle, topology initialization, health monitoring.
- `agent_*`: Agent spawning, role assignment, capability injection.
- `memory_*`: Vector storage, cosine similarity search, memory consolidation.
- `intelligence_*`: 4-phase cognitive loop ($\text{RETRIEVE} \rightarrow \text{JUDGE} \rightarrow \text{DISTILL} \rightarrow \text{CONSOLIDATE}$).
- `task_*`: Task creation, assignment, verification, and completion.
- `hooks_*`: Pre-task, post-task, routing, and lifecycle hooks.

---

## 💻 CLI Commands (Streaming Terminal)

Inside the Sentient-UI cybernetic terminal, operators can run:
- `/topology <mesh|hierarchical|star|ring>`: Instantly switch the graph topology.
- `/spawn <name> <role>`: Provision a new neural agent into the active swarm.
- `/mission <objective>`: Trigger the GOAP planner to generate and execute an $A^*$ action plan.
- `/vote <ballot_name>`: Initiate a Byzantine quorum vote across all active agents.
- `/memory <query>`: Perform a high-dimensional vector search against the memory store.
- `/clear`: Clear terminal history.
