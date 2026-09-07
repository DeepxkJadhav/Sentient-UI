import math
from typing import List, Dict, Any

class AgentVectorMemory:
    """
    Persistent Semantic State & Agent Context Memory
    Backed by vector indexing for continuous multi-turn agent coordination.
    """
    def __init__(self):
        self.memory_store: List[Dict[str, Any]] = []

    def _embed(self, text: str) -> List[float]:
        vec = [0.0] * 64
        words = text.lower().split()
        for idx, w in enumerate(words):
            h = sum(ord(c) for c in w)
            vec[h % 64] += 1.0 / (idx + 1.0)
        norm = math.sqrt(sum(x * x for x in vec)) or 1.0
        return [x / norm for x in vec]

    def store_memory(self, agent_role: str, content: str, metadata: Dict[str, Any] = None) -> str:
        import uuid
        mem_id = str(uuid.uuid4())
        vec = self._embed(content)
        
        self.memory_store.append({
            "id": mem_id,
            "agent": agent_role,
            "content": content,
            "vector": vec,
            "metadata": metadata or {}
        })
        return mem_id

    def recall_memories(self, query: str, top_k: int = 3) -> List[Dict[str, Any]]:
        if not self.memory_store:
            return []
        
        q_vec = self._embed(query)
        scores = []
        for item in self.memory_store:
            dot = sum(a * b for a, b in zip(q_vec, item["vector"]))
            scores.append((dot, item))
        
        scores.sort(key=lambda x: x[0], reverse=True)
        return [
            {
                "id": it["id"],
                "agent": it["agent"],
                "content": it["content"],
                "score": round(float(s), 4)
            }
            for s, it in scores[:top_k]
        ]
