# Contributing to Sentient-UI

Contributions to Sentient-UI are welcome. Follow these steps to report issues, suggest improvements, or submit code changes.

---

## Code of conduct

Be respectful and constructive when participating in discussions, code reviews, and issue threads.

---

## Reporting bugs

1. Check existing issues on GitHub to see if the problem has already been reported.
2. If not, open a new issue using the bug report template.
3. Include clear reproduction steps, what you expected to happen, what actually happened, and your environment details (Node.js version, OS, browser).

---

## Feature requests

Open a feature request on GitHub with:
- The problem you want to solve.
- Your proposed solution or interface changes.
- Any alternative approaches you evaluated.

---

## Pull request process

1. Fork the repository on GitHub (`https://github.com/DeepxkJadhav/Sentient-UI`).
2. Clone your fork locally:
   ```bash
   git clone https://github.com/<your-username>/Sentient-UI.git
   cd Sentient-UI
   ```
3. Create a branch for your work:
   ```bash
   git checkout -b fix/canvas-resize
   ```
4. Install dependencies:
   ```bash
   npm install
   ```
5. Run the dev servers to test changes:
   - Frontend: `npm run dev`
   - Backend: `npm run server`
6. Verify the production build passes with no errors:
   ```bash
   npm run build
   ```
7. Commit using conventional commit format:
   ```bash
   git commit -m "fix(canvas): prevent node clipping on small screens"
   ```
8. Push your branch and open a pull request against `main`.

---

## Code guidelines

- Use TypeScript with explicit types where reasonable. Avoid `any`.
- Keep components modular within `src/components/`.
- Use shared context in `src/context/` for application-wide state.
- Keep the canvas rendering efficient; avoid unnecessary allocations inside the main render loop.
- Test that `npm run build` succeeds before opening your pull request.
