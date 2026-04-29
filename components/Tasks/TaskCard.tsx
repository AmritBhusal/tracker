"use client";

import { useState, useEffect, useRef } from "react";
import { Calendar, Pencil, ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { STATUS_ORDER, STATUS_LABELS } from "@/lib/constants";
import type { Task, TaskStatus } from "@/types";

type Props = {
  task: Task;
  onEdit: (task: Task) => void;
  onMove: (task: Task, newStatus: TaskStatus) => void;
  onDelete: (task: Task) => void;
};

export default function TaskCard({ task, onEdit, onMove, onDelete }: Props) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const deleteTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clean up the auto-dismiss timer on unmount
  useEffect(() => {
    return () => {
      if (deleteTimer.current) clearTimeout(deleteTimer.current);
    };
  }, []);

  const formattedDate = new Date(task.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  const idx = STATUS_ORDER.indexOf(task.status);
  const canGoLeft = idx > 0;
  const canGoRight = idx < STATUS_ORDER.length - 1;

  function moveLeft(e: React.MouseEvent) {
    e.stopPropagation();
    if (canGoLeft) onMove(task, STATUS_ORDER[idx - 1]);
  }

  function moveRight(e: React.MouseEvent) {
    e.stopPropagation();
    if (canGoRight) onMove(task, STATUS_ORDER[idx + 1]);
  }

  function handleDelete(e: React.MouseEvent) {
    e.stopPropagation();
    if (confirmDelete) {
      onDelete(task);
      return;
    }
    setConfirmDelete(true);
    // Auto-dismiss the confirmation after a short delay
    if (deleteTimer.current) clearTimeout(deleteTimer.current);
    deleteTimer.current = setTimeout(() => setConfirmDelete(false), 2500);
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onEdit(task)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onEdit(task);
        }
      }}
      className="bg-surface border border-amber-200/70 rounded-xl p-4 sm:p-6 hover:border-[#FF5500]/30 hover:shadow-md hover:shadow-[#FF5500]/5 transition-all duration-300 cursor-pointer group shadow-sm shadow-amber-100/40 outline-none focus-visible:ring-2 focus-visible:ring-[#FF5500]/40"
    >
      <div className="flex items-start justify-between gap-2 sm:gap-3">
        <p className="text-base sm:text-lg font-semibold text-stone-800 leading-snug group-hover:text-stone-900">
          {task.title}
        </p>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(task);
          }}
          className="opacity-0 group-hover:opacity-100 mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center text-stone-400 hover:bg-[#FF5500]/10 hover:text-[#FF5500] transition-all duration-200 flex-shrink-0 cursor-pointer"
          title="Edit task"
        >
          <Pencil size={15} />
        </button>
      </div>

      {task.description && (
        <p className="text-sm sm:text-base text-stone-500 mt-2 sm:mt-2.5 line-clamp-2 leading-relaxed">
          {task.description}
        </p>
      )}

      <div className="flex items-center gap-2 mt-3 sm:mt-4">
        <Calendar size={14} className="text-stone-400" />
        <span className="text-xs sm:text-sm text-stone-400 font-medium">
          {formattedDate}
        </span>
      </div>

      {/*
        Move / delete controls.
        Always visible on mobile (no hover), hidden-until-hover on desktop.
      */}
      <div className="flex flex-wrap items-center justify-between gap-2 mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-amber-200/50 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300">
        <div className="flex items-center gap-2">
          {canGoLeft && (
            <button
              onClick={moveLeft}
              className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs font-semibold rounded-lg bg-amber-50 text-stone-500 hover:bg-[#FF5500]/10 hover:text-[#FF5500] border border-amber-200/60 hover:border-[#FF5500]/20 transition-all duration-200 cursor-pointer"
              title={`Move to ${STATUS_LABELS[STATUS_ORDER[idx - 1]]}`}
            >
              <ChevronLeft size={14} strokeWidth={2.5} />
              <span className="hidden sm:inline">{STATUS_LABELS[STATUS_ORDER[idx - 1]]}</span>
            </button>
          )}
          {canGoRight && (
            <button
              onClick={moveRight}
              className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs font-semibold rounded-lg bg-amber-50 text-stone-500 hover:bg-[#FF5500]/10 hover:text-[#FF5500] border border-amber-200/60 hover:border-[#FF5500]/20 transition-all duration-200 cursor-pointer"
              title={`Move to ${STATUS_LABELS[STATUS_ORDER[idx + 1]]}`}
            >
              <span className="hidden sm:inline">{STATUS_LABELS[STATUS_ORDER[idx + 1]]}</span>
              <ChevronRight size={14} strokeWidth={2.5} />
            </button>
          )}
        </div>

        <button
          onClick={handleDelete}
          className={cn(
            "inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs font-semibold rounded-lg border transition-all duration-200 cursor-pointer",
            confirmDelete
              ? "bg-red-500 text-white border-red-500 shadow-md shadow-red-500/20"
              : "bg-amber-50 text-stone-400 border-amber-200/60 hover:bg-red-50 hover:text-red-500 hover:border-red-200"
          )}
          title={confirmDelete ? "Click again to confirm" : "Delete task"}
        >
          <Trash2 size={14} />
          {confirmDelete ? "Confirm?" : "Delete"}
        </button>
      </div>
    </div>
  );
}
