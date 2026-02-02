from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine
from app import models
from app.routers.members import router as members_router
from app.routers.books import router as books_router
from app.routers.borrowings import router as borrowings_router

app = FastAPI(title="Neighborhood Library Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(members_router)
app.include_router(books_router)
app.include_router(borrowings_router)

@app.get("/health")
def health_check():
    return {"status": "ok"}