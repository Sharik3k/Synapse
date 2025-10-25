import os
import numpy as np
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv() # take environment variables from .env.

# --- OpenRouter Client Setup ---
client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("OPENROUTER_API_KEY"),
)

# Recommended models
EMBEDDING_MODEL = "text-embedding-ada-002" # Example, you can choose another like text-embedding-3-large
SUMMARY_MODEL = "openai/gpt-4o" # Or any other powerful model

import backend.db as db # Use absolute import from backend package
import hdbscan
from sklearn.preprocessing import normalize

def get_embedding(text: str, model: str = EMBEDDING_MODEL):
    print(f"Getting embedding for: {text[:30]}... using {model}")
    text = text.replace("\n", " ")
    try:
        response = client.embeddings.create(
            model=model,
            input=[text]
        )
        return response.data[0].embedding
    except Exception as e:
        print(f"Error getting embedding: {e}")
        return []

def generate_summary(member_texts: list[str], model: str = SUMMARY_MODEL):
    print(f"Generating summary for {len(member_texts)} ideas using {model}...")
    
    ideas_formatted = "\n".join([f"- {idea}" for idea in member_texts])
    
    prompt = f"""You are an assistant that summarizes a cluster of user ideas.
Input: list of short user idea strings.

Ideas:
{ideas_formatted}

Output format:
Title: <short phrase (3-5 words)>
Summary: <1 sentence>
Actionable:
- <bullet1>
- <bullet2>
- <bullet3>
"""

    try:
        completion = client.chat.completions.create(
            extra_headers={
                "HTTP-Referer": "http://localhost:3000", # Your app's URL
                "X-Title": "Synapse", # Your app's name
            },
            model=model,
            messages=[
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
        )
        return completion.choices[0].message.content
    except Exception as e:
        print(f"Error generating summary: {e}")
        return "Error: Could not generate summary."

def add_idea(user, text):
    embedding = get_embedding(text)
    if not embedding:
        return None # Or handle error appropriately
    idea_id = db.insert_idea(user, text, embedding)
    return idea_id

def get_clusters():
    return db.get_clusters_with_details()

def process_clusters():
    ideas_data = db.get_all_ideas_with_embeddings()
    if len(ideas_data) < 2: # Not enough data to cluster
        print("Not enough ideas to create clusters.")
        return

    # Convert to a list of dictionaries to work with
    ideas = [dict(row) for row in ideas_data]

    X = np.array([idea['embedding'] for idea in ideas])
    
    # Normalize embeddings for cosine similarity
    X = normalize(X)

    # Initialize and fit HDBSCAN
    # min_cluster_size=3 means a cluster must have at least 3 ideas
    # allow_single_cluster=True is good for small number of ideas
    clusterer = hdbscan.HDBSCAN(
        min_cluster_size=3, 
        metric='euclidean', # After normalization, euclidean is equivalent to cosine
        allow_single_cluster=True
    )
    labels = clusterer.fit_predict(X)

    for idea, label in zip(ideas, labels):
        db.update_idea_cluster(idea['id'], int(label))
    
    # Generate cluster summaries
    db.clear_clusters() # Clear old summaries before generating new ones
    clusters_with_texts = db.get_ideas_by_cluster()
    
    for cid, texts in clusters_with_texts.items():
        if cid == -1: # Skip noise points, which HDBSCAN labels as -1
            print(f"Skipping summary for {len(texts)} noise idea(s).")
            continue
        if texts:
            summary = generate_summary(texts)
            # We can also generate a label/title here in the future
            db.save_cluster_summary(cid, summary, label=f"Cluster {cid}")
