from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import Base, engine
from routers import jobs, requests, technicians


@asynccontextmanager
async def lifespan(_app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield


app = FastAPI(
    title="The Green Resourcerers API",
    description=(
        "Backend API for The Green Resourcerers LLC — "
        "satellite-dish removal and environmental recycling service."
    ),
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(requests.router)
app.include_router(jobs.router)
app.include_router(technicians.router)


@app.get("/")
def root():
    return {
        "message": "Welcome to The Green Resourcerers API",
        "docs": "/docs",
    }
