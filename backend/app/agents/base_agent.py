from abc import ABC, abstractmethod
from typing import Dict, Any, List
from app.router.llm_router import MultiLLMRouter
from app.memory.vector_memory import AgentVectorMemory

class BaseAgent(ABC):
    def __init__(self, name: str, role: str, router: MultiLLMRouter, memory: AgentVectorMemory):
        self.name = name
        self.role = role
        self.router = router
        self.memory = memory

    @abstractmethod
    def execute_task(self, task_instruction: str, context: Dict[str, Any] = None) -> Dict[str, Any]:
        pass
