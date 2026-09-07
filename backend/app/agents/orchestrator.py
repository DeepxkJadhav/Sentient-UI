from typing import Dict, Any, List
from app.router.llm_router import MultiLLMRouter
from app.memory.vector_memory import AgentVectorMemory
from app.agents.specialized_agents import CoderAgent, SecurityAgent, DevOpsAgent

class SentientOrchestrator:
    """
    Autonomous Multi-Agent Swarm Orchestrator.
    Decomposes user objectives into sub-tasks and delegates to specialized subagents.
    """
    def __init__(self):
        self.router = MultiLLMRouter()
        self.memory = AgentVectorMemory()
        
        self.agents = {
            "coder": CoderAgent(name="Sentient-Coder", role="Systems & Algorithm Architect", router=self.router, memory=self.memory),
            "security": SecurityAgent(name="Sentient-Security", role="Vulnerability & Threat Auditor", router=self.router, memory=self.memory),
            "devops": DevOpsAgent(name="Sentient-DevOps", role="Container & Kubernetes Infrastructure", router=self.router, memory=self.memory)
        }

    def dispatch_objective(self, user_prompt: str) -> Dict[str, Any]:
        # 1. Routing for task planning
        plan_routing = self.router.route_request("architecture_design", complexity="high")
        
        # 2. Sequential execution across subagents
        coder_res = self.agents["coder"].execute_task(user_prompt)
        sec_res = self.agents["security"].execute_task(user_prompt, context=coder_res)
        devops_res = self.agents["devops"].execute_task(user_prompt, context=sec_res)

        return {
            "objective": user_prompt,
            "orchestrator_model": plan_routing["selected_model"],
            "plan_rationale": plan_routing["routing_rationale"],
            "agent_swarm_execution": [coder_res, sec_res, devops_res],
            "total_memories_indexed": len(self.memory.memory_store),
            "swarm_status": "SUCCESS"
        }
