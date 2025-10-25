from fastapi import FastAPI
from pydantic import BaseModel
from .ai_engine import add_idea, process_clusters, get_clusters

app = FastAPI()

class IdeaIn(BaseModel):
    user: str
    text: str

@app.post("/ideas")
async def create_idea(payload: IdeaIn):
    idea_id = add_idea(payload.user, payload.text)
    return {"id": idea_id}

@app.post("/process")
async def process():
    process_clusters()
    return {"status": "processing_started"}

@app.get("/clusters")
async def clusters():
    return get_clusters()
