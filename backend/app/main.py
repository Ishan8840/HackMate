from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings


app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "World!"}