import sys
import os

# Add the project root to the Python path to allow importing from 'backend'
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend import db
from backend import ai_engine

SAMPLE_IDEAS = [
    # Cluster 1: AI in Education
    ("student_A", "Personalized learning paths for students using AI tutors."),
    ("teacher_B", "Automated grading system for essays to save teachers time."),
    ("student_C", "Using AI to create interactive and adaptive textbooks."),

    # Cluster 2: Sustainable Urban Living
    ("citizen_X", "Smart traffic light system to reduce congestion and pollution."),
    ("activist_Y", "Community gardens on rooftops of apartment buildings."),
    ("mayor_Z", "An app to track and reward household recycling efforts."),

    # Cluster 3: Future of Remote Work
    ("dev_1", "Virtual reality meeting rooms for better team collaboration."),
    ("hr_2", "A 4-day work week to improve employee well-being."),
    ("manager_3", "Tools for monitoring mental health of remote employees."),

    # Noise/Unique Ideas
    ("pet_lover", "A social network for pet owners."),
    ("coffee_fan", "A subscription box for artisanal coffee."),
]

def run_backfill():
    print("Starting to backfill the database with sample ideas...")
    
    # Optional: Clear existing ideas to start fresh
    # conn = db.get_db_connection()
    # conn.execute('DELETE FROM ideas')
    # conn.commit()
    # conn.close()
    # print("Cleared existing ideas.")

    for user, text in SAMPLE_IDEAS:
        print(f'Adding idea: "{text}"')
        # This will call the get_embedding function and then insert into the DB
        ai_engine.add_idea(user, text)
    
    print("\nDatabase backfill complete!")
    print(f"{len(SAMPLE_IDEAS)} ideas have been added.")

if __name__ == "__main__":
    # This allows running the script directly from the command line
    run_backfill()
