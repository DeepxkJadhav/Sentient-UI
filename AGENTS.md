# Sentient-UI Agent Guide

Guidance for automated agents and operators working with Sentient-UI.
Maintainer: [Deepxk Jadhav](https://github.com/DeepxkJadhav)

---

## Swarm topologies

Sentient-UI organizes agent communication into four graph layouts:

| Topology | Use case | Communication flow |
|----------|----------|-------------------|
| Hierarchical | Structured teams with lead delegation | Parent nodes assign tasks down to child nodes |
| Mesh | Collaborative problem solving | All active agents can communicate with each other |
| Star | Centralized dispatch | A coordinator node manages all worker connections |
| Ring | Sequential pipelines | Each agent passes its completed work to the next node |

---

## Goal-Oriented Action Planning (GOAP)

The planner uses an A* graph search to build execution sequences:

1. World state evaluation: Checks boolean condition flags, including whether goals are defined, tests pass, security reviews complete, and deployment is ready.
2. Action preconditions and effects: Each registered action defines required input state and resulting output state.
3. Execution loop: Agents run steps in order and update world state flags after each result.
4. Replanning: If an action returns an error, the solver recalculates a path from the updated state.

---

## Consensus protocols

Critical operations such as deployments, schema changes, and role assignments use voting protocols:

- Byzantine fault tolerance (3f+1): Requires a 67% or greater supermajority to proceed even if some nodes fail or return bad data.
- Raft: Standard majority (over 50%) for coordinator election and log replication.
- Paxos: Distributed quorum agreement.
- Gossip: Eventual consistency across peer-to-peer mesh networks.

---

## MCP tool namespaces

Sentient-UI provides Model Context Protocol (MCP) tools across six primary groups:

- `swarm_*`: Controls swarm initialization, topology changes, and status checks.
- `agent_*`: Spawns agents and sets role capabilities.
- `memory_*`: Stores and searches entries using vector embeddings.
- `intelligence_*`: Runs the four-step loop (retrieve, judge, distill, and consolidate).
- `task_*`: Creates, assigns, and tracks task progress.
- `hooks_*`: Manages pre-task, post-task, and lifecycle hooks.

---

## Terminal commands

The terminal interface supports these commands:

- `/topology <mesh|hierarchical|star|ring>`: Changes the current graph topology.
- `/spawn <name> <role>`: Adds an agent to the fleet.
- `/mission <objective>`: Runs the GOAP planner on a given objective.
- `/vote <ballot_name>`: Starts a consensus ballot.
- `/memory <query>`: Searches memory using vector similarity.
- `/clear`: Clears the terminal screen.
