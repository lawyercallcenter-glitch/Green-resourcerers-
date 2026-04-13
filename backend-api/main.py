"""Green Resourcerers — FastAPI backend entry point."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import Base, engine, settings
from routers import jobs, requests, technicians

# Create all tables on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Green Resourcerers API",
    description=(
        "Backend for The Green Resourcerers LLC — satellite dish removal "
        "and environmental recycling service. Handles homeowner requests, "
        "job creation, and technician field updates."
    ),
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS — allow the website and mobile dev servers
origins = [o.strip() for o in settings.allowed_origins.split(",")]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(requests.router)
app.include_router(jobs.router)
app.include_router(technicians.router)


@app.get("/", tags=["health"])
def health_check():
    return {"status": "ok", "service": "Green Resourcerers API"}


@app.get("/health", tags=["health"])
def health():
    return {"status": "ok"}
