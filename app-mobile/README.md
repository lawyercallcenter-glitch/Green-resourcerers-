# Mobile App — Green Resourcerers

React Native / Expo app with two modes:

| Tab | For | Description |
|-----|-----|-------------|
| 🔧 My Jobs | Technicians | View assigned jobs, update status, log materials |
| 📋 Request Removal | Homeowners | Submit a satellite dish removal request |

## Screens

- **TechnicianDashboardScreen** — filterable job list with status badges
- **JobDetailScreen** — update job status, dishes removed, weight, technician notes
- **HomeownerRequestScreen** — full intake form wired to the backend API

## Setup

```bash
npm install
npx expo start
```

Scan the QR code with the **Expo Go** app on your phone, or press `i`/`a` to open an iOS/Android emulator.

## Configuration

The API base URL is set in `src/api.ts`. Change `API_BASE` to point to your production server:

```ts
export const API_BASE = 'https://api.greenresourcerers.com'
```

## Building for Production

```bash
npx eas build --platform all
```
