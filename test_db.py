import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

try:
    conn = psycopg2.connect(
        host=os.environ.get("PG_HOST", "localhost"),
        port=os.environ.get("PG_PORT", "5433"),
        dbname=os.environ.get("PG_DB", "kss_db"),
        user=os.environ.get("PG_USER", "kss_user"),
        password=os.environ.get("PG_PASSWORD", "")
    )
    print("Connected to PostgreSQL successfully!")
    conn.close()
except Exception as e:
    print(f"Connection failed: {e}")