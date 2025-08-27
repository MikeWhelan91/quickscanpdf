
# QuickScan PDF (Expo SDK 51, pinned deps)

Fast, private document scanner that auto‑crops pages and exports clean PDFs with a realistic scanned look.

## Features

- Live auto‑crop guide while lining up the camera
- Cross-platform scanned-look previews that match the exported PDF

- Node **18 or 20** required.
- No config-plugins in app.json (prevents expo-print plugin errors).

## Install
```
npm install
npx expo install --fix    # optional, should be clean already
npm run start
```
If Windows shows a Node parse error like `Unexpected token 'typeof'`, ensure you're on Node 18/20: `node -v`.
