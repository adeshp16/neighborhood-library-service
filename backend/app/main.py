from fastapi import FastAPI
from app.database import Base, engine
from app import models
from app.routers.members import router as members_router
from app.routers.books import router as books_router
from app.routers.borrowings import router as borrowings_router

app = FastAPI(title="Neighborhood Library Service")

app.include_router(members_router)
app.include_router(books_router)
app.include_router(borrowings_router)

@app.get("/health")
def health_check():
    return {"status": "ok"}