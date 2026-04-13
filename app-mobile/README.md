# Green Resourcerers — Mobile App

Technician field app and homeowner request mode for **The Green Resourcerers LLC** — satellite-dish removal and environmental recycling service.

Built with [React Native](https://reactnative.dev/) and [Expo](https://expo.dev/).

## Screens

| Screen                 | Description                                        |
| ---------------------- | -------------------------------------------------- |
| Technician Dashboard   | View assigned jobs, navigate to details             |
| Homeowner Request      | Submit a new satellite-dish removal request          |
| Job Detail             | Full job info, status updates, notes, photos        |

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- iOS Simulator, Android Emulator, or the **Expo Go** app on a physical device

## Setup

```bash
cd app-mobile
npm install
```

## Running

```bash
# Start the Expo dev server
npm start

# Or target a specific platform
npm run ios
npm run android
npm run web
```

Scan the QR code with Expo Go (Android) or the Camera app (iOS) to open on a device.

## Project Structure

```
app-mobile/
├── App.tsx                        # Navigation setup
├── app.json                       # Expo configuration
├── package.json
├── tsconfig.json
└── src/
    └── screens/
        ├── TechnicianDashboard.tsx # Main dashboard
        ├── HomeownerRequest.tsx    # New request form
        └── JobDetail.tsx           # Job details & status
```

## License

Proprietary — The Green Resourcerers LLC
