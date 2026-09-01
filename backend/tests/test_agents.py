from fastapi.testclient import TestClient
import sys, os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.main import app

client = TestClient(app)

def test_system_status():
    res = client.get("/api/v1/system/status")
    assert res.status_code == 200
    assert res.json()["status"] == "HEALTHY"

def test_swarm_execution():
    res = client.post("/api/v1/swarm/execute", json={"prompt": "Build an authentication API with FastAPI"})
    assert res.status_code == 200
    data = res.json()
    assert data["swarm_status"] == "SUCCESS"
    assert len(data["agent_swarm_execution"]) == 3
