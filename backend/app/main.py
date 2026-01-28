from fastapi import FastAPI

app = FastAPI(title="Neighborhood Library Service")

@app.get("/health")
def health_check():
    return {"status": "ok"}