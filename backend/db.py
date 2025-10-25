import sqlite3
import json
from datetime import datetime

DATABASE_NAME = "synapse.db"

def get_db_connection():
    conn = sqlite3.connect(DATABASE_NAME)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Create ideas table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS ideas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user TEXT NOT NULL,
            text TEXT NOT NULL,
            embedding TEXT, -- Stored as JSON string
            cluster_id INTEGER,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Create clusters table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS clusters (
            id INTEGER PRIMARY KEY,
            label TEXT,
            summary TEXT
        )
    ''')
    
    conn.commit()
    conn.close()

# --- DB interaction functions ---

def insert_idea(user: str, text: str, embedding: list) -> int:
    conn = get_db_connection()
    cursor = conn.cursor()
    embedding_json = json.dumps(embedding)
    cursor.execute(
        "INSERT INTO ideas (user, text, embedding) VALUES (?, ?, ?)",
        (user, text, embedding_json)
    )
    idea_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return idea_id

def get_all_ideas_with_embeddings():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, embedding, text FROM ideas WHERE embedding IS NOT NULL")
    rows = cursor.fetchall()
    conn.close()
    # Parse embedding back to list
    for row in rows:
        row = dict(row) # Convert Row object to dict to make it mutable
        row['embedding'] = json.loads(row['embedding'])
    return rows

def update_idea_cluster(idea_id: int, cluster_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE ideas SET cluster_id = ? WHERE id = ?", (cluster_id, idea_id))
    conn.commit()
    conn.close()

def clear_clusters():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM clusters")
    conn.commit()
    conn.close()

def save_cluster_summary(cluster_id: int, summary: str, label: str = None):
    conn = get_db_connection()
    cursor = conn.cursor()
    label = label or f"Cluster {cluster_id}"
    cursor.execute(
        "INSERT OR REPLACE INTO clusters (id, label, summary) VALUES (?, ?, ?)",
        (cluster_id, label, summary)
    )
    conn.commit()
    conn.close()

def get_ideas_by_cluster():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT cluster_id, text FROM ideas WHERE cluster_id IS NOT NULL ORDER BY cluster_id")
    rows = cursor.fetchall()
    conn.close()
    
    clusters = {}
    for row in rows:
        cid = row['cluster_id']
        if cid not in clusters:
            clusters[cid] = []
        clusters[cid].append(row['text'])
    return clusters

def get_clusters_with_details():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, label, summary FROM clusters")
    cluster_rows = cursor.fetchall()
    
    result = {}
    for cluster_row in cluster_rows:
        cluster_id = cluster_row['id']
        # Find members of this cluster
        cursor.execute("SELECT text, user, created_at FROM ideas WHERE cluster_id = ?", (cluster_id,))
        idea_rows = cursor.fetchall()
        result[cluster_id] = {
            'label': cluster_row['label'],
            'summary': cluster_row['summary'],
            'members': [dict(row) for row in idea_rows]
        }

    conn.close()
    return result

# Initialize the database and tables when the module is first imported
init_db()
