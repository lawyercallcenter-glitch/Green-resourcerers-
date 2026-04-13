# The Green Resourcerers – Monorepo

This repository contains the entire operational system for The Green Resourcerers LLC, including:

- **backend-api** – FastAPI backend for homeowner requests, job creation, technician updates, and admin operations
- **app-mobile** – React Native (Expo) mobile app for technicians and homeowners
- **website** – React/Vite landing page + public request form
- **docs** – Business documents, grant materials, SOPs, capability statement, and operational templates

This monorepo powers the full workflow:

> Homeowner → Request Form → Backend → Admin Dashboard → Technician App → Completion → Reporting

---

## 📁 Repository Structure

```
green-resourcerers/
  backend-api/
  app-mobile/
  website/
  docs/
  README.md
```

---

## 🚀 backend-api (FastAPI)

**Location:** `/backend-api`

Handles:

- Homeowner request intake
- Job creation
- Job listing
- Job status updates
- Technician workflow

Run locally:

```bash
cd backend-api
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

---

## 📱 app-mobile (React Native / Expo)

**Location:** `/app-mobile`

Contains:

- Homeowner request mode
- Technician job list
- Job detail + status updates

Run locally:

```bash
cd app-mobile
npm install
npx expo start
```

---

## 🌐 website (React / Vite)

**Location:** `/website`

Contains:

- Landing page
- Homeowner request form
- API connection to backend

Run locally:

```bash
cd website
npm install
npm run dev
```

---

## 📄 docs (Business + Grant Documents)

**Location:** `/docs`

Includes:

- Capability Statement
- Budget Sheet
- 18-Month Timeline
- Community Impact Statement
- Certification Funding Justification
- Safety SOPs
- Liability Waiver
- Grant-ready materials

---

## 🧩 Tech Stack

| Layer    | Technology                    |
|----------|-------------------------------|
| Backend  | FastAPI, Python, Uvicorn      |
| Mobile   | React Native (Expo)           |
| Website  | React + Vite                  |
| Storage  | Local for MVP (S3 later)      |
| Database | In-memory for MVP (Postgres later) |

---

## 🛠️ Development Workflow

1. Start backend
2. Start website
3. Start mobile app
4. Connect mobile + website to backend via LAN IP
5. Commit changes to monorepo
6. Deploy backend + website when ready

---

## 🧱 Future Enhancements

- Technician authentication
- Photo upload (S3)
- Admin dashboard
- Job map
- Environmental impact metrics
- Postgres database
- Production deployment
