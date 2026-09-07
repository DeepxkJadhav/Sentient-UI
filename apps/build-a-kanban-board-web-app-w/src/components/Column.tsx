// src/components/Column.tsx
import { useMemo } from "react";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { PlusCircle } from "lucide-react";
import { Column as ColumnType, Id, Task } from "../types";
import TaskCard from "./TaskCard";

interface Props {
  column: ColumnType;
  tasks: Task[];
  createTask: (columnId: Id) => void;
  deleteTask: (id: Id) => void;
  updateTask: (id: Id, content: string) => void;
}

export default function Column({ column, tasks, createTask, deleteTask, updateTask }: Props) {
  const tasksIds = useMemo(() => tasks.map((task) => task.id), [tasks]);

  return (
    <div className="bg-slate-900 w-[350px] h-[500px] max-h-[800px] rounded-2xl flex flex-col border border-slate-700 shadow-xl">
      {/* Title */}
      <div className="bg-slate-800 text-md h-[60px] cursor-default rounded-t-2xl border-b-2 border-slate-700 p-4 font-bold flex items-center justify-between">
        <div className="flex gap-2">
          <span className="bg-slate-700 px-2 py-1 rounded-full text-xs">
            {tasks.length}
          </span>
          {column.title}
        </div>
      </div>

      {/* Task Container */}
      <div className="flex flex-grow flex-col gap-4 p-4 overflow-x-hidden overflow-y-auto">
        <SortableContext items={tasksIds} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard 
              key={task.id} 
              task={task} 
              deleteTask={deleteTask} 
              updateTask={updateTask}
            />
          ))}
        </SortableContext>
      </div>

      {/* Footer */}
      <button
        onClick={() => createTask(column.id)}
        className="flex gap-2 items-center border-t border-slate-700 p-4 hover:bg-slate-800 hover:text-blue-500 transition-colors"
      >
        <PlusCircle size={20} />
        Add Task
      </button>
    </div>
  );
}
