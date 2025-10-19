from fastapi import FastAPI

app = FastAPI(title="FinanceTracker Pro API", version="0.0.1")

@app.get("/health")
def health():
    return {"status": "ok"}
