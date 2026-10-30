# Local Development Configuration — Sentient-UI

## Environment Variables

```bash
PORT=3000
SERVER_PORT=3001
WS_PORT=3001
NODE_ENV=development
```

## Running Locally

1. **Frontend**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

2. **Backend Telemetry Server**:
   ```bash
   npm run server
   ```
   Listens on `http://localhost:3001` and `ws://localhost:3001/ws`.

3. **Production Verification**:
   ```bash
   npm run build
   ```
