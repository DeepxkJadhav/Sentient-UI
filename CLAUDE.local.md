# Local development: Sentient-UI

## Environment variables

```bash
PORT=3000
SERVER_PORT=3001
WS_PORT=3001
NODE_ENV=development
```

## Running locally

Frontend:
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

Backend server:
```bash
npm run server
```
Listens on `http://localhost:3001` with WebSocket connections at `ws://localhost:3001/ws`.

Production build check:
```bash
npm run build
```
