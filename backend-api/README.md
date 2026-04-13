# Backend API — Green Resourcerers

FastAPI service that powers the full workflow:

```
Homeowner → Request Form → Backend → Admin → Technician App → Completion → Reporting
```

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/requests/` | Submit a homeowner removal request |
| GET | `/requests/` | List all requests (admin) |
| GET | `/requests/{id}` | Get a single request |
| PATCH | `/requests/{id}` | Update request status (admin) |
| DELETE | `/requests/{id}` | Remove a request (admin) |
| POST | `/jobs/` | Create a job from a request (admin) |
| GET | `/jobs/` | List jobs |
| GET | `/jobs/{id}` | Get a job |
| PATCH | `/jobs/{id}` | Admin job update |
| POST | `/technicians/` | Register a technician |
| GET | `/technicians/` | List technicians |
| GET | `/technicians/{id}/jobs` | Get technician's jobs |
| PATCH | `/technicians/{id}/jobs/{job_id}` | Technician field update |

## Setup

```bash
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env             # edit as needed
uvicorn main:app --reload
```

Visit **http://localhost:8000/docs** for the interactive API documentation.

## Testing

```bash
pip install pytest httpx
pytest test_main.py -v
```
