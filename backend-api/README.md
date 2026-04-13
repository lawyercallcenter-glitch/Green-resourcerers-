# The Green Resourcerers API

Backend API for **The Green Resourcerers LLC** — satellite-dish removal and environmental recycling service. Handles homeowner request intake, job creation, and technician job updates.

## Setup

### 1. Create a virtual environment

```bash
cd backend-api
python -m venv venv
source venv/bin/activate  # Linux/macOS
# venv\Scripts\activate   # Windows
```

### 2. Install dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure environment variables

```bash
cp .env.example .env
# Edit .env with your settings
```

### 4. Run the development server

```bash
uvicorn main:app --reload
```

The API will be available at `http://127.0.0.1:8000`.

Interactive docs are at `http://127.0.0.1:8000/docs`.

## API Endpoints

| Resource          | Method | Path                  | Description              |
|-------------------|--------|-----------------------|--------------------------|
| Service Requests  | POST   | `/requests/`          | Create a new request     |
|                   | GET    | `/requests/`          | List all requests        |
|                   | GET    | `/requests/{id}`      | Get a single request     |
|                   | PATCH  | `/requests/{id}`      | Update request status    |
| Jobs              | POST   | `/jobs/`              | Create a job             |
|                   | GET    | `/jobs/`              | List all jobs            |
|                   | GET    | `/jobs/{id}`          | Get a single job         |
|                   | PATCH  | `/jobs/{id}`          | Update job status/notes  |
| Technicians       | POST   | `/technicians/`       | Register a technician    |
|                   | GET    | `/technicians/`       | List all technicians     |
|                   | GET    | `/technicians/{id}`   | Get a single technician  |
|                   | PATCH  | `/technicians/{id}`   | Update technician info   |
