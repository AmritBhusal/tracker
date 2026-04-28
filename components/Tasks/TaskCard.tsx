"use client";

import React from "react";
import { Calendar, Pencil } from "lucide-react";
import type { Task } from "./CreateTaskDialog";

type Props = {
  task: Task;
  onEdit: (task: Task) => void;
};

export default function TaskCard({ task, onEdit }: Props) {
  const date = new Date(task.createdAt);
  const formattedDate = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <div
      onClick={() => onEdit(task)}
      className="bg-white border border-stone-200/80 rounded-xl p-5 hover:border-[#FF5500]/30 hover:shadow-md hover:shadow-[#FF5500]/5 transition-all duration-300 cursor-pointer group"
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-base font-semibold text-stone-800 leading-snug group-hover:text-stone-900">
          {task.title}
        </p>
        <button
          className="opacity-0 group-hover:opacity-100 mt-0.5 w-7 h-7 rounded-lg flex items-center justify-center text-stone-400 hover:bg-[#FF5500]/10 hover:text-[#FF5500] transition-all duration-200 flex-shrink-0"
          title="Edit task"
        >
          <Pencil size={13} />
        </button>
      </div>
      {task.description && (
        <p className="text-sm text-stone-500 mt-2 line-clamp-2 leading-relaxed">
          {task.description}
        </p>
      )}
      <div className="flex items-center gap-2 mt-3.5">
        <Calendar size={13} className="text-stone-400" />
        <span className="text-xs text-stone-400 font-medium">
          {formattedDate}
        </span>
      </div>
    </div>
  );
}
