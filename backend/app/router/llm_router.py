import time
from typing import Dict, Any, Tuple
from app.config import settings

class MultiLLMRouter:
    """
    Intelligent Multi-LLM Routing Engine.
    Dynamically selects optimal model provider (OpenAI, Claude, Gemini, Local OSS)
    based on task domain, reasoning depth, latency budget, and token economics.
    """
    def __init__(self):
        self.pricing_table = {
            "claude-3-5-sonnet": {"input_cost_per_1k": 0.003, "output_cost_per_1k": 0.015, "speed": "high", "tier": "frontier"},
            "gpt-4o": {"input_cost_per_1k": 0.005, "output_cost_per_1k": 0.015, "speed": "high", "tier": "frontier"},
            "gpt-4o-mini": {"input_cost_per_1k": 0.00015, "output_cost_per_1k": 0.0006, "speed": "ultra-fast", "tier": "economy"},
            "gemini-1.5-pro": {"input_cost_per_1k": 0.0035, "output_cost_per_1k": 0.0105, "speed": "high", "tier": "long-context"},
            "llama3-local": {"input_cost_per_1k": 0.0, "output_cost_per_1k": 0.0, "speed": "instant", "tier": "private-local"}
        }

    def route_request(self, task_type: str, complexity: str = "medium", privacy_required: bool = False) -> Dict[str, Any]:
        start = time.time()
        
        if privacy_required:
            selected_model = "llama3-local"
            reason = "Task marked for strict on-premise local inference"
        elif task_type in ["architecture_design", "security_audit", "complex_refactoring"] or complexity == "high":
            selected_model = "claude-3-5-sonnet"
            reason = "High reasoning and structural integrity needed for systems design"
        elif task_type in ["code_explanation", "syntax_linting", "doc_generation"] or complexity == "low":
            selected_model = "gpt-4o-mini"
            reason = "Optimized for sub-second latency and minimal token cost"
        elif task_type in ["multi_file_analysis", "repo_indexing"]:
            selected_model = "gemini-1.5-pro"
            reason = "Leveraging massive context window for repository mapping"
        else:
            selected_model = "gpt-4o"
            reason = "Balanced multi-modal routing for general orchestration"

        route_latency_ms = round((time.time() - start) * 1000, 3)
        
        return {
            "selected_model": selected_model,
            "provider": self._get_provider(selected_model),
            "tier": self.pricing_table[selected_model]["tier"],
            "decision_latency_ms": route_latency_ms,
            "routing_rationale": reason
        }

    def _get_provider(self, model: str) -> str:
        if "claude" in model: return "Anthropic"
        if "gpt" in model: return "OpenAI"
        if "gemini" in model: return "Google"
        return "Local (Ollama/vLLM)"
