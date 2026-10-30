# Contributing to Sentient-UI

Thank you for your interest in contributing to **Sentient-UI**! Sentient-UI is an autonomous multi-agent swarm orchestrator, neural cockpit, and visual mission control plane designed for high-agency coding agents.

We welcome contributions from developers, researchers, designers, and AI engineers.

---

## Code of Conduct

We are committed to providing a welcoming, inclusive, and harassment-free environment for everyone. Please treat all contributors and community members with respect, constructive feedback, and professionalism.

---

## How to Contribute

### 1. Reporting Bugs
- Check the [Issue Tracker](https://github.com/DeepxkJadhav/Sentient-UI/issues) to ensure your issue hasn't already been reported.
- If not, create a new issue using our **Bug Report** template.
- Provide a clear description, reproduction steps, expected vs. actual behavior, and environment details (Node version, OS, browser).

### 2. Suggesting Features & Enhancements
- Open a feature request on [GitHub Issues](https://github.com/DeepxkJadhav/Sentient-UI/issues).
- Describe the motivation, use case, proposed architecture, and how it benefits the Sentient-UI ecosystem.

### 3. Submitting Pull Requests
1. **Fork the Repository**:
   Click "Fork" on GitHub at `https://github.com/DeepxkJadhav/Sentient-UI`.
2. **Clone Your Fork**:
   ```bash
   git clone https://github.com/<your-username>/Sentient-UI.git
   cd Sentient-UI
   ```
3. **Create a Feature Branch**:
   ```bash
   git checkout -b feat/your-feature-name
   # or fix/your-bugfix-name
   ```
4. **Install Dependencies**:
   ```bash
   npm install
   ```
5. **Develop & Test**:
   - Run the development frontend: `npm run dev`
   - Run the WebSocket backend: `npm run server`
   - Build and verify: `npm run build`
6. **Commit Your Changes**:
   Follow [Conventional Commits](https://www.conventionalcommits.org/):
   ```bash
   git commit -m "feat(topology): add particle glow effects to canvas edges"
   ```
7. **Push to Your Fork**:
   ```bash
   git push origin feat/your-feature-name
   ```
8. **Open a Pull Request**:
   Submit a PR against the `main` branch of `DeepxkJadhav/Sentient-UI`. Fill out the PR template thoroughly.

---

## Development Standards

- **TypeScript Strictness**: All new code must be fully typed without `any` wherever possible.
- **Tailwind CSS**: Follow responsive, utility-first design principles with cybernetic dark-mode aesthetics.
- **Component Modularity**: Keep UI components isolated in `src/components/` and shared state in `src/context/`.
- **Zero Console Leaks**: Do not leave extraneous `console.log` statements in production components.
- **Build Verification**: Ensure `npm run build` compiles cleanly with zero TypeScript or Vite errors before pushing.

---

## Questions & Discussions

Have questions or ideas? Start a discussion or open an issue at:
👉 **[Sentient-UI GitHub Discussions / Issues](https://github.com/DeepxkJadhav/Sentient-UI/issues)**
