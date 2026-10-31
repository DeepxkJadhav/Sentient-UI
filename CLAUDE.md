# Development instructions: Sentient-UI

Project: Sentient-UI  
Maintainer: Deepxk Jadhav (https://github.com/DeepxkJadhav/Sentient-UI)  
Stack: React 19, TypeScript 5, Vite 6, Tailwind CSS 3, Express, WebSocket, Canvas 2D  

---

## Commands

```bash
# Install dependencies
npm install

# Start Vite frontend (http://localhost:3000)
npm run dev

# Start WebSocket server (http://localhost:3001)
npm run server

# Production build
npm run build

# Preview build
npm run preview
```

---

## Architecture and standards

- Frontend code is in `src/`. Use functional React components and explicit TypeScript types.
- Canvas animation is in `src/components/TopologyCanvas.tsx` using `requestAnimationFrame`. Keep allocations out of the render loop to maintain 60fps.
- Swarm state is managed in `src/context/SwarmContext.tsx`.
- Backend server is in `server/index.ts` using Express and `ws`.
- Styling uses Tailwind CSS with dark slate backgrounds and neon accent colors.

---

## Guidelines

- Keep the project identity as Sentient-UI by Deepxk Jadhav.
- Preserve existing component logic in `src/` and `server/`.
- Verify `npm run build` exits 0 before committing.
