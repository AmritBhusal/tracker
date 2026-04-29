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
  const deleteTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (deleteTimerRef.current) clearTimeout(deleteTimerRef.current);
    };
  }, []);

  const formattedDate = new Date(task.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  const currentIndex = STATUS_ORDER.indexOf(task.status);
  const canMoveLeft = currentIndex > 0;
  const canMoveRight = currentIndex < STATUS_ORDER.length - 1;

  const handleMoveLeft = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (canMoveLeft) onMove(task, STATUS_ORDER[currentIndex - 1]);
  };

  const handleMoveRight = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (canMoveRight) onMove(task, STATUS_ORDER[currentIndex + 1]);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirmDelete) {
      onDelete(task);
    } else {
      setConfirmDelete(true);
      if (deleteTimerRef.current) clearTimeout(deleteTimerRef.current);
      deleteTimerRef.current = setTimeout(() => setConfirmDelete(false), 2500);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onEdit(task);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onEdit(task)}
      onKeyDown={handleKeyDown}
      className="bg-surface border border-amber-200/70 rounded-xl p-6 hover:border-[#FF5500]/30 hover:shadow-md hover:shadow-[#FF5500]/5 transition-all duration-300 cursor-pointer group shadow-sm shadow-amber-100/40 outline-none focus-visible:ring-2 focus-visible:ring-[#FF5500]/40"
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-lg font-semibold text-stone-800 leading-snug group-hover:text-stone-900">
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
        <p className="text-base text-stone-500 mt-2.5 line-clamp-2 leading-relaxed">
          {task.description}
        </p>
      )}

      <div className="flex items-center gap-2.5 mt-4">
        <Calendar size={14} className="text-stone-400" />
        <span className="text-sm text-stone-400 font-medium">
          {formattedDate}
        </span>
      </div>

      {/* Slide between columns + delete — only visible on hover */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-amber-200/50 opacity-0 group-hover:opacity-100 transition-all duration-300">
        <div className="flex items-center gap-2">
          {canMoveLeft && (
            <button
              onClick={handleMoveLeft}
              className="inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold rounded-lg bg-amber-50 text-stone-500 hover:bg-[#FF5500]/10 hover:text-[#FF5500] border border-amber-200/60 hover:border-[#FF5500]/20 transition-all duration-200 cursor-pointer"
              title={`Move to ${STATUS_LABELS[STATUS_ORDER[currentIndex - 1]]}`}
            >
              <ChevronLeft size={14} strokeWidth={2.5} />
              {STATUS_LABELS[STATUS_ORDER[currentIndex - 1]]}
            </button>
          )}
          {canMoveRight && (
            <button
              onClick={handleMoveRight}
              className="inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold rounded-lg bg-amber-50 text-stone-500 hover:bg-[#FF5500]/10 hover:text-[#FF5500] border border-amber-200/60 hover:border-[#FF5500]/20 transition-all duration-200 cursor-pointer"
              title={`Move to ${STATUS_LABELS[STATUS_ORDER[currentIndex + 1]]}`}
            >
              {STATUS_LABELS[STATUS_ORDER[currentIndex + 1]]}
              <ChevronRight size={14} strokeWidth={2.5} />
            </button>
          )}
        </div>

        <button
          onClick={handleDeleteClick}
          className={cn(
            "inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border transition-all duration-200 cursor-pointer",
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
