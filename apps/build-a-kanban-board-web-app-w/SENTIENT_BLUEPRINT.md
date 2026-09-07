# Sentient Build Blueprint

## Objective
Build a Kanban board web app with drag-and-drop and local storage

## Architecture
As the **Sentient Architect Agent**, I have analyzed your objective. Below is the blueprint for a clean, modular Kanban system.

---

### 1. Technical Requirements & User Flow

**Technical Requirements:**
*   **Framework:** React (Functional components, Hooks).
*   **State Management:** Persistence via `localStorage` API.
*   **Drag-and-Drop:** `@dnd-kit/core` (modular, accessible) or `react-beautiful-dnd`.
*   **Styling:** Tailwind CSS (utility-first, responsive).
*   **Type Safety:** TypeScript for defining task and column schemas.

**User Flow:**
1.  **Initialize:** App loads; system checks `localStorage` for existing board data. If empty, loads default columns (To Do, Doing, Done).
2.  **Creation:** User types task details into a "New Task" input/modal. Task is assigned a unique ID and timestamp.
3.  **Interaction:** User drags a task card from one column and drops it into another.
4.  **Sync:** Every state change (move, edit, delete) triggers an asynchronous sync to `localStorage`.
5.  **Persistence:** On page refresh, the UI reconstructs from the saved JSON state.

---

### 2. System Architecture & Component Structure

The system follows a **Unidirectional Data Flow** pattern.

**Component Hierarchy:**
*   **Board (Container):** Manages the primary state and DND context.
    *   **Column (Layout):** Represents a status bucket; handles task filtering.
        *   **TaskCard (Atom):** Displays data; provides drag handles.
    *   **TaskModal (UI):** Form for creating/editing task details.

**Modular Structure:**
*   **Store/Context:** A `KanbanContext` to prevent prop-drilling.
*   **Hooks:** `useLocalStorage` custom hook to sync state automatically.
*   **Logic:** Pure utility functions for reordering arrays (immutability-first).

---

### 3. Recommended Files & Formats

```text
kanban-app/
├── src/
│   ├── types/
│   │   └── index.ts          # Interfaces (Task, Column, Id)
│   ├── hooks/
│   │   ├── useLocalStorage.ts # Custom persistence logic
│   │   └── useKanban.ts      # Business logic (add, move, delete)
│   ├── components/
│   │   ├── Board.tsx         # DND Context Provider
│   │   ├── Column.tsx        # Droppable container
│   │   ├── TaskCard.tsx      # Draggable item
│   │   └── UI/
│   │       ├── Button.tsx    # Atomic UI components
│   │       └── Input.tsx
│   ├── utils/
│   │   └── dndHelpers.ts     # Array move logic (reorder/move)
│   ├── App.tsx               # Main entry point
│   └── main.tsx
├── tailwind.config.js
└── package.json
```

**Data Format (JSON):**
```json
{
  "tasks": [
    { "id": "1", "content": "Design API", "columnId": "todo" },
    { "id": "2", "content": "Setup Repo", "columnId": "doing" }
  ],
  "columns": [
    { "id": "todo", "title": "To Do" },
    { "id": "doing", "title": "In Progress" },
    { "id": "done", "title": "Completed" }
  ]
}
```

This architecture ensures that the **Logic (Hooks)** is decoupled from the **View (Components)**, allowing for easy expansion (e.g., adding a backend API) without refactoring the UI.

## Review Verdict
### **Sentient Reviewer Agent Audit Report**

#### **1. Security Evaluation**
*   **XSS (Cross-Site Scripting):** **Low Risk.** React automatically escapes content rendered in the DOM. Since the task content is handled via `textarea` value and standard JSX curly braces, common injection vectors are mitigated. 
*   **Data Leakage:** **Low Risk.** The app uses `window.localStorage`. While local storage is accessible to any script on the same origin, for a client-side productivity tool, this is the standard and expected behavior.
*   **Injection/Integrity:** **Medium-Low Risk.** The ID generation logic `Math.floor(Math.random() * 10001)` is prone to collisions as the task list grows. This could lead to UI glitches where multiple tasks share the same key, causing `@dnd-kit` to malfunction or state to overwrite incorrectly.
*   **Input Sanitization:** **Low Risk.** There is no backend; however, if this were to be connected to an API, the `updateTask` function allows raw string input which should be sanitized server-side.

#### **2. Quality Score: 82/100**
*   **Pros:** Excellent use of TypeScript interfaces, clean component separation, and effective use of `useMemo` for performance optimization. The `useLocalStorage` hook is a solid implementation of the "State-Sync" pattern.
*   **Cons:** 
    1.  **Missing Droppable Logic:** The `Column` component is not registered as a droppable target using `useDroppable`. This means dragging a task into an *empty* column will fail because the `onDragOver` event won't detect the column as a valid "over" target.
    2.  **Focus Management:** The `autoFocus` attribute on the `TaskCard`'s `textarea` will trigger on every task every time the board renders, which can cause erratic scroll behavior or focus stealing.
    3.  **State Thrashing:** Updating the task on `onChange` inside the `TaskCard` triggers a full `Board` re-render and a `localStorage.setItem` call on every single keystroke. This will cause lag on lower-end devices or with large task lists.

#### **3. Verdict: REVISE**
The code is aesthetically and structurally sound, but the drag-and-drop logic for empty columns is incomplete, and the ID generation/performance handling needs refinement for a "production-ready" claim.

---

#### **4. Recommended Execution Steps**

**Step 1: Fix ID Generation**
Replace the random number with a UUID to prevent collisions.
```typescript
// src/components/Board.tsx
function createTask(columnId: Id) {
  const newTask: Task = {
    id: crypto.randomUUID(), // More robust than Math.random()
    columnId,
    content: `New Task ${tasks.length + 1}`,
  };
  setTasks([...tasks, newTask]);
}
```

**Step 2: Enable Column Dropping**
Update `Column.tsx` to use `useDroppable` so tasks can be dragged into empty columns.
```tsx
// src/components/Column.tsx (Add these imports)
import { useDroppable } from "@dnd-kit/core";

// Inside the component:
const { setNodeRef } = useDroppable({
  id: column.id,
  data: {
    type: "Column",
    column,
  },
});

return (
  <div ref={setNodeRef} className="..."> 
    {/* ... rest of the component */}
  </div>
);
```

**Step 3: Optimize Input Performance**
Use local state within `TaskCard` for the textarea and only sync to the global `setTasks` on `onBlur`.
```tsx
// src/components/TaskCard.tsx
const [editMode, setEditMode] = useState(false);
const [value, setValue] = useState(task.content);

// Change textarea to:
<textarea
  value={value}
  onChange={(e) => setValue(e.target.value)}
  onBlur={() => {
    setEditMode(false);
    updateTask(task.id, value);
  }}
/>
```

**Step 4: Fix Focus**
Remove `autoFocus` from the general `TaskCard` template and only apply it when a task is specifically being edited or was just created.
