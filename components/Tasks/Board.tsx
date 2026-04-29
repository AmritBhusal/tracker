import React from "react";
import { Plus, Circle, Loader2, CheckCircle2 } from "lucide-react";
import TaskCard from "./TaskCard";
import { STATUS_LIST } from "@/lib/constants";
import type { Task, TaskStatus } from "@/types";

const COLUMN_ICONS: Record<TaskStatus, { icon: React.ElementType; color: string }> = {
  todo:          { icon: Circle,       color: "text-stone-400" },
  "in-progress": { icon: Loader2,      color: "text-[#FF5500]" },
  done:          { icon: CheckCircle2,  color: "text-emerald-500" },
};

type Props = {
  tasks: Task[];
  onAddToColumn: (status: TaskStatus) => void;
  onEditTask: (task: Task) => void;
  onMoveTask: (task: Task, newStatus: TaskStatus) => void;
  onDeleteTask: (task: Task) => void;
};

export default function Board({
  tasks,
  onAddToColumn,
  onEditTask,
  onMoveTask,
  onDeleteTask,
}: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {STATUS_LIST.map((col) => {
        const columnTasks = tasks.filter((t) => t.status === col.value);
        const { icon: Icon, color } = COLUMN_ICONS[col.value];

        return (
          <div key={col.value} className="flex flex-col">
            <div className="flex items-center justify-between mb-4 px-1">
              <div className="flex items-center gap-3">
                <Icon size={19} className={color} />
                <span className="text-lg font-semibold text-stone-700">
                  {col.label}
                </span>
                <span className="text-sm font-bold text-stone-400 bg-amber-100/60 rounded-lg px-2.5 py-0.5 min-w-[26px] text-center">
                  {columnTasks.length}
                </span>
              </div>
              <button
                onClick={() => onAddToColumn(col.value)}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-stone-400 hover:bg-[#FF5500]/5 hover:text-[#FF5500] border border-transparent hover:border-[#FF5500]/20 transition-all duration-200 cursor-pointer"
                title={`Add task to ${col.label}`}
              >
                <Plus size={18} strokeWidth={2.5} />
              </button>
            </div>

            <div className="flex-1 bg-amber-50/40 border border-amber-200/50 rounded-2xl p-4 space-y-3.5 min-h-[240px]">
              {columnTasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full min-h-[200px] text-center">
                  <p className="text-base text-stone-400">No tasks yet</p>
                  <button
                    onClick={() => onAddToColumn(col.value)}
                    className="mt-2.5 text-base text-[#FF5500] font-medium hover:underline underline-offset-2 cursor-pointer"
                  >
                    + Add one
                  </button>
                </div>
              ) : (
                columnTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onEdit={onEditTask}
                    onMove={onMoveTask}
                    onDelete={onDeleteTask}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
