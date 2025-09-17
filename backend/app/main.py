from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from supabase import create_client, Client


app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SUPABASE_URL = settings.supabase_url
SUPABASE_KEY = settings.supabase_key

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)


@app.get("/")
def read_root():
    return {"message": "hello"}


@app.get("/projects")
def read_root():
    response = (
        supabase.table("projects")
        .select("*")
        .limit(10)
        .execute()
    )

    return response.data