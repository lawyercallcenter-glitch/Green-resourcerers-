# The Green Resourcerers LLC

**Satellite-dish removal and precious metal recovery / environmental recycling service**

---

## Overview

This monorepo contains all software components for The Green Resourcerers LLC — a service that removes obsolete satellite dishes from residential properties and responsibly recycles them, recovering precious metals and diverting waste from landfills.

## Monorepo Structure

```
├── backend-api/    # FastAPI backend service
├── website/        # React/Vite public-facing website
├── app-mobile/     # React Native/Expo technician mobile app
├── docs/           # Project documentation
└── README.md
```

### `backend-api/` — FastAPI Backend

REST API powering the platform. Handles service-request intake, job scheduling, technician dispatch, customer notifications, and reporting. Built with **FastAPI** and backed by a relational database.

### `website/` — React / Vite Website

Public-facing marketing and customer portal. Homeowners can learn about the service, request a dish removal, and track their order status. Built with **React** and bundled with **Vite**.

### `app-mobile/` — React Native / Expo Mobile App

Field technician mobile application. Technicians receive assigned jobs, capture before/after photos, log materials recovered, and mark jobs complete. Built with **React Native** using the **Expo** managed workflow.

### `docs/` — Documentation

Project-wide documentation including architecture decisions, API references, onboarding guides, and operational runbooks.

## Business Workflow

```
Homeowner → Request Form (website) → Backend API → Admin Review → Technician App → Job Completion → Reporting
```

1. **Homeowner** visits the website and submits a satellite-dish removal request.
2. **Request Form** data is sent to the backend API.
3. **Backend** validates the request, stores it, and notifies the admin team.
4. **Admin** reviews and approves the request, then assigns it to a technician.
5. **Technician App** receives the assignment; the technician travels to the site and performs the removal.
6. **Completion** — the technician logs recovered materials and uploads photos via the mobile app.
7. **Reporting** — the backend generates recycling reports, customer receipts, and environmental-impact summaries.

## Getting Started

### Prerequisites

- **Python 3.11+** (backend)
- **Node.js 18+** and **npm** (website)
- **Node.js 18+**, **npm**, and **Expo CLI** (mobile app)

### Backend API

```bash
cd backend-api
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### Website

```bash
cd website
npm install
npm run dev
```

### Mobile App

```bash
cd app-mobile
npm install
npx expo start
```

### Documentation

Documentation lives in the `docs/` directory and can be viewed directly on GitHub or served locally with your preferred static-site tool.

## License

*License information to be determined. See [LICENSE](LICENSE) when available.*
