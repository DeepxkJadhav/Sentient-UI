import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import Dict, Any, Optional

from app.config import settings
from app.agents.orchestrator import SentientOrchestrator

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Autonomous Multi-Agent AI Operating System with Dynamic Multi-LLM Routing"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

orchestrator = SentientOrchestrator()

class ObjectiveRequest(BaseModel):
    prompt: str
    priority: Optional[str] = "normal"

class MemoryQueryRequest(BaseModel):
    query: str

@app.get("/")
def get_dashboard():
    static_file = os.path.join(os.path.dirname(__file__), "static", "index.html")
    if os.path.exists(static_file):
        return FileResponse(static_file)
    return {
        "system": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "status": "OPERATIONAL",
        "active_subagents": ["Sentient-Coder", "Sentient-Security", "Sentient-DevOps"]
    }

@app.post("/api/v1/swarm/execute")
def execute_swarm_objective(req: ObjectiveRequest):
    if not req.prompt.strip():
        raise HTTPException(status_code=400, detail="Objective prompt cannot be empty.")
    
    result = orchestrator.dispatch_objective(req.prompt)
    return result

@app.post("/api/v1/memory/search")
def search_agent_memory(req: MemoryQueryRequest):
    memories = orchestrator.memory.recall_memories(req.query, top_k=5)
    return {
        "query": req.query,
        "recalled_memories": memories
    }

@app.get("/api/v1/system/status")
def system_status():
    return {
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "status": "HEALTHY",
        "subagents_online": 3,
        "indexed_memories": len(orchestrator.memory.memory_store),
        "supported_models": list(orchestrator.router.pricing_table.keys())
    }
