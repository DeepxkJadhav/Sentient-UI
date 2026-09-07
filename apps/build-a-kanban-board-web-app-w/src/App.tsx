// src/App.tsx
import Board from "./components/Board";

function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <header className="p-6 border-b border-slate-800">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
          Sentient Kanban
        </h1>
      </header>
      <main className="flex-grow">
        <Board />
      </main>
    </div>
  );
}

export default App;
