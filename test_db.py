import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

try:
    database_url = os.environ.get("DATABASE_URL") or os.environ.get("PG_DATABASE_URL")
    sslmode = os.environ.get("PG_SSLMODE")
    sslrootcert = os.environ.get("PG_SSLROOTCERT")
    connect_kwargs = {}

    if database_url:
        connect_kwargs["dsn"] = database_url
    else:
        connect_kwargs.update(
            {
                "host": os.environ.get("PG_HOST", "localhost"),
                "port": os.environ.get("PG_PORT", "5432"),
                "dbname": os.environ.get("PG_DB", "kss_db"),
                "user": os.environ.get("PG_USER", "kss_user"),
                "password": os.environ.get("PG_PASSWORD", ""),
            }
        )

    if sslmode:
        connect_kwargs["sslmode"] = sslmode
    if sslrootcert:
        connect_kwargs["sslrootcert"] = sslrootcert

    conn = psycopg2.connect(**connect_kwargs)
    print("Connected to PostgreSQL successfully!")
    conn.close()
except Exception as e:
    print(f"Connection failed: {e}")
