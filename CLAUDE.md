# Claude Instructions — Sentient-UI

> Project: **Sentient-UI**  
> Maintainer: **Deepxk Jadhav** (`https://github.com/DeepxkJadhav/Sentient-UI`)  
> Tech Stack: React 19, TypeScript 5, Vite 6, Tailwind CSS 3, Express, WebSocket, Canvas 2D  

---

## 🛠️ Build & Development Commands

```bash
# Install dependencies
npm install

# Start Vite frontend development server (http://localhost:3000)
npm run dev

# Start WebSocket & telemetry bridge (http://localhost:3001)
npm run server

# Full production build (Typecheck + Vite bundle)
npm run build

# Preview production build locally
npm run preview
```

---

## 📐 Architecture & Standards

- **Frontend**: Located in `src/`. Built with modern React 19, functional components, hooks, and clean TypeScript interfaces.
- **Canvas Physics**: In `src/components/TopologyCanvas.tsx`, uses native 2D Canvas with requestAnimationFrame for 60fps rendering of nodes, edges, pulses, and physics.
- **State Management**: In `src/context/SwarmContext.tsx`, handles real-time agent rosters, GOAP plans, consensus ballots, and log streams.
- **Backend Bridge**: In `server/index.ts`, Express HTTP server with `ws` WebSocket broadcast on port 3001.
- **Style Guidelines**: Tailwind CSS with cybernetic dark theme (`#080b11`, `#0f172a`, `#1e293b`), crisp neon accents (`cyan`, `emerald`, `indigo`, `purple`, `rose`), and high-contrast typography.

---

## 🚫 Critical Guidelines

- **Never** add mentions of external or legacy framework names. The identity is exclusively **Sentient-UI** by **Deepxk Jadhav**.
- **Preserve** existing working component code in `src/` and `server/`.
- Ensure all builds (`npm run build`) pass with 0 errors before committing.
