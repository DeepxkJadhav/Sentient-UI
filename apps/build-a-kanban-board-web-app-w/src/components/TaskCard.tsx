// src/components/TaskCard.tsx
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Trash2, GripVertical } from "lucide-react";
import { Id, Task } from "../types";

interface Props {
  task: Task;
  deleteTask: (id: Id) => void;
  updateTask: (id: Id, content: string) => void;
}

export default function TaskCard({ task, deleteTask, updateTask }: Props) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="opacity-30 bg-slate-800 p-4 min-h-[100px] items-center flex text-left rounded-xl border-2 border-blue-500 cursor-grab relative"
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-slate-800 p-4 min-h-[100px] items-center flex text-left rounded-xl hover:ring-2 hover:ring-inset hover:ring-blue-500 cursor-default group relative shadow-sm"
    >
      <div 
        {...attributes} 
        {...listeners} 
        className="mr-2 h-full cursor-grab opacity-50 hover:opacity-100"
      >
        <GripVertical size={20} />
      </div>
      
      <textarea
        className="h-[90%] w-full resize-none border-none rounded bg-transparent text-white focus:outline-none"
        value={task.content}
        autoFocus
        placeholder="Task content here"
        onBlur={(e) => updateTask(task.id, e.target.value)}
        onChange={(e) => updateTask(task.id, e.target.value)}
      />

      <button
        onClick={() => deleteTask(task.id)}
        className="stroke-white absolute right-4 top-1/2 -translate-y-1/2 bg-slate-700 p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-900"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}
