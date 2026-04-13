# The Green Resourcerers — Website

Public landing page and service request form for **The Green Resourcerers LLC**, a satellite-dish removal and environmental recycling service.

## Tech Stack

- **React 18** with TypeScript
- **Vite 5** for development and builds
- **React Router 6** for client-side routing

## Getting Started

```bash
cd website
npm install
npm run dev
```

The development server will start at `http://localhost:5173`.

## Available Scripts

| Command           | Description                          |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Start the Vite dev server            |
| `npm run build`   | Type-check with `tsc` and build      |
| `npm run preview` | Preview the production build locally |

## Project Structure

```
website/
├── index.html
├── src/
│   ├── main.tsx            # Entry point with BrowserRouter
│   ├── App.tsx             # Route definitions
│   ├── pages/
│   │   ├── Home.tsx        # Landing page
│   │   └── RequestForm.tsx # Service request form
│   └── components/
│       ├── Header.tsx      # Navigation header
│       └── Footer.tsx      # Page footer
├── package.json
├── tsconfig.json
└── vite.config.ts
```
