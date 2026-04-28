"use client";

import React from "react";
import { Plus, Circle, Loader2, CheckCircle2 } from "lucide-react";
import TaskCard from "./TaskCard";
import type { Task, TaskStatus } from "./CreateTaskDialog";

type ColumnDef = {
  status: TaskStatus;
  label: string;
  icon: React.ElementType;
  iconColor: string;
};

const COLUMNS: ColumnDef[] = [
  {
    status: "todo",
    label: "To Do",
    icon: Circle,
    iconColor: "text-stone-400",
  },
  {
    status: "in-progress",
    label: "In Progress",
    icon: Loader2,
    iconColor: "text-[#FF5500]",
  },
  {
    status: "done",
    label: "Done",
    icon: CheckCircle2,
    iconColor: "text-emerald-500",
  },
];

type Props = {
  tasks: Task[];
  onAddToColumn: (status: TaskStatus) => void;
  onEditTask: (task: Task) => void;
};

export default function Board({ tasks, onAddToColumn, onEditTask }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {COLUMNS.map((col) => {
        const columnTasks = tasks.filter((t) => t.status === col.status);
        const Icon = col.icon;

        return (
          <div key={col.status} className="flex flex-col">
            {/* Column Header */}
            <div className="flex items-center justify-between mb-3 px-1">
              <div className="flex items-center gap-2.5">
                <Icon size={17} className={col.iconColor} />
                <span className="text-base font-semibold text-stone-700">
                  {col.label}
                </span>
                <span className="text-xs font-bold text-stone-400 bg-stone-100 rounded-lg px-2 py-0.5 min-w-[24px] text-center">
                  {columnTasks.length}
                </span>
              </div>
              <button
                onClick={() => onAddToColumn(col.status)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-stone-400 hover:bg-[#FF5500]/5 hover:text-[#FF5500] border border-transparent hover:border-[#FF5500]/20 transition-all duration-200 cursor-pointer"
                title={`Add task to ${col.label}`}
              >
                <Plus size={17} strokeWidth={2.5} />
              </button>
            </div>

            {/* Column Body */}
            <div className="flex-1 bg-stone-100/50 border border-stone-200/60 rounded-2xl p-3.5 space-y-3 min-h-[220px]">
              {columnTasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full min-h-[180px] text-center">
                  <p className="text-sm text-stone-400">No tasks yet</p>
                  <button
                    onClick={() => onAddToColumn(col.status)}
                    className="mt-2 text-sm text-[#FF5500] font-medium hover:underline underline-offset-2 cursor-pointer"
                  >
                    + Add one
                  </button>
                </div>
              ) : (
                columnTasks.map((task) => (
                  <TaskCard key={task.id} task={task} onEdit={onEditTask} />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
