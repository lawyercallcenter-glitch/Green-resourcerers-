# Green Resourcerers LLC — Monorepo

Monorepo for **The Green Resourcerers LLC** — the full operational stack for our satellite‑dish removal and environmental recycling service.

## Repository Structure

| Directory | Stack | Purpose |
|-----------|-------|---------|
| [`backend-api/`](./backend-api) | FastAPI (Python) | Homeowner request intake, job creation, technician job updates |
| [`app-mobile/`](./app-mobile) | React Native / Expo | Technician field app + homeowner request mode |
| [`website/`](./website) | React / Vite | Landing page + public request form |
| [`docs/`](./docs) | Markdown | Capability statement, budget, timeline, SOPs, legal, grant materials |

## Business Workflow

```
Homeowner → Request Form → Backend API → Admin Review
        → Technician App → Job Completion → Reporting
```

## Quick Start

### Backend API
```bash
cd backend-api
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
# API docs: http://localhost:8000/docs
```

### Website
```bash
cd website
npm install
npm run dev
# Opens: http://localhost:5173
```

### Mobile App
```bash
cd app-mobile
npm install
npx expo start
```

## About

The Green Resourcerers LLC rescues and responsibly recycles obsolete satellite dishes,
recovering precious metals and keeping electronics out of landfills. Homeowners schedule
free removal, certified technicians complete the job, and materials enter our certified
recycling pipeline.

## License

Proprietary — All Rights Reserved © 2025 The Green Resourcerers LLC
