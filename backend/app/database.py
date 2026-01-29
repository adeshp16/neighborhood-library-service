from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise RuntimeError(
        "DATABASE_URL environment variable is not set.\n"
        "Please set it to your PostgreSQL connection string before running the app.\n"
        "Example:\n"
        "  export DATABASE_URL=postgresql://username:password@localhost:5432/<db_name>\n"
        "For this app, <db_name> should be 'library_db'."
    )

# Using connection pool for efficiency under concurrent requests
# With pooling connections are reused efficiently, reducing latency and DB load
engine = create_engine(
    DATABASE_URL,
    echo=False,
    pool_size=10,
    max_overflow=20
    )


SessionLocal = sessionmaker(
    autocommit = False,
    autoflush= False,
    bind=engine
)

Base = declarative_base()

# Dependency for FastAPI
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()