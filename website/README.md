# Website — Green Resourcerers

Landing page and public request form built with **React 18** and **Vite**.

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page — hero, how it works, benefits, CTA |
| `/request` | Homeowner removal request form |

## Setup

```bash
npm install
npm run dev
# Opens: http://localhost:5173
```

The dev server proxies `/api/*` calls to `http://localhost:8000` (FastAPI).

## Build

```bash
npm run build   # outputs to dist/
npm run preview # serve the production build locally
```
