"use client";

import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export type TaskStatus = "todo" | "in-progress" | "done";

export type Task = {
  id: string;
  projectSlug: string;
  title: string;
  description: string;
  status: TaskStatus;
  createdAt: string;
};

const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: "todo", label: "To Do" },
  { value: "in-progress", label: "In Progress" },
  { value: "done", label: "Done" },
];

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTaskCreated: (task: Task) => void;
  onTaskUpdated?: (task: Task) => void;
  projectSlug: string;
  defaultStatus?: TaskStatus;
  editingTask?: Task | null;
};

export default function CreateTaskDialog({
  open,
  onOpenChange,
  onTaskCreated,
  onTaskUpdated,
  projectSlug,
  defaultStatus = "todo",
  editingTask = null,
}: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TaskStatus>(defaultStatus);
  const [error, setError] = useState("");

  const isEditing = !!editingTask;

  // Populate fields when dialog opens
  React.useEffect(() => {
    if (open) {
      if (editingTask) {
        setTitle(editingTask.title);
        setDescription(editingTask.description);
        setStatus(editingTask.status);
      } else {
        setTitle("");
        setDescription("");
        setStatus(defaultStatus);
      }
      setError("");
    }
  }, [open, editingTask, defaultStatus]);

  const handleClose = (isOpen: boolean) => {
    if (!isOpen) {
      setTitle("");
      setDescription("");
      setStatus(defaultStatus);
      setError("");
    }
    onOpenChange(isOpen);
  };

  const handleSubmit = () => {
    const trimmed = title.trim();
    if (!trimmed) {
      setError("Task title cannot be empty.");
      return;
    }

    if (isEditing && editingTask) {
      const updatedTask: Task = {
        ...editingTask,
        title: trimmed,
        description: description.trim(),
        status,
      };
      onTaskUpdated?.(updatedTask);
    } else {
      const newTask: Task = {
        id: uuidv4(),
        projectSlug,
        title: trimmed,
        description: description.trim(),
        status,
        createdAt: new Date().toISOString(),
      };
      onTaskCreated(newTask);
    }

    handleClose(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-white border border-stone-200 rounded-2xl text-stone-800 max-w-md p-0 gap-0 overflow-hidden shadow-2xl shadow-stone-200/50">
        {/* Top accent bar */}
        <div className="h-1.5 w-full bg-[#FF5500]" />

        <div className="px-8 pt-7 pb-8">
          <DialogHeader className="mb-7">
            <DialogTitle className="text-2xl font-bold tracking-tight text-stone-800">
              {isEditing ? "Edit Task" : "New Task"}
            </DialogTitle>
            <DialogDescription className="text-stone-500 text-base mt-1.5">
              {isEditing
                ? "Update the task details below."
                : "Add a task to your project board."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5">
            {/* Title */}
            <div className="space-y-2.5">
              <Label className="text-xs uppercase tracking-[0.15em] font-bold text-stone-500">
                Task Title
              </Label>
              <Input
                autoFocus
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setError("");
                }}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                placeholder="e.g. Design the landing page"
                className="bg-stone-50 border-stone-200 rounded-xl text-stone-800 placeholder:text-stone-400 focus-visible:ring-2 focus-visible:ring-[#FF5500]/30 focus-visible:border-[#FF5500] text-base h-12 px-4 transition-all"
              />
              {error && (
                <p className="text-sm text-red-500 font-medium">{error}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2.5">
              <Label className="text-xs uppercase tracking-[0.15em] font-bold text-stone-500">
                Description <span className="text-stone-300 normal-case tracking-normal">(optional)</span>
              </Label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add some details…"
                rows={3}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl text-stone-800 placeholder:text-stone-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5500]/30 focus-visible:border-[#FF5500] text-base px-4 py-3 transition-all resize-none"
              />
            </div>

            {/* Status */}
            <div className="space-y-3">
              <Label className="text-xs uppercase tracking-[0.15em] font-bold text-stone-500">
                Status
              </Label>
              <div className="flex gap-2.5">
                {STATUS_OPTIONS.map((opt) => {
                  const isSelected = status === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setStatus(opt.value)}
                      className={`flex-1 px-3 py-2.5 text-xs uppercase tracking-wider font-semibold rounded-xl border transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? "bg-[#FF5500] text-white border-transparent shadow-md shadow-[#FF5500]/20"
                          : "bg-stone-50 text-stone-500 border-stone-200 hover:bg-[#FF5500]/5 hover:text-[#FF5500] hover:border-[#FF5500]/30"
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <DialogFooter className="mt-8 flex flex-row gap-3 sm:gap-3">
            <Button
              type="button"
              onClick={() => handleClose(false)}
              className="flex-1 rounded-xl text-sm font-medium bg-stone-100 text-stone-600 border border-stone-200 hover:bg-stone-200 hover:text-stone-800 cursor-pointer h-12 transition-all duration-200"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              className="flex-1 bg-[#FF5500] hover:bg-[#E04A00] text-white rounded-xl text-sm font-semibold cursor-pointer h-12 border-0 shadow-lg shadow-[#FF5500]/20 hover:shadow-[#FF5500]/30 transition-all duration-300"
            >
              {isEditing ? "Save Changes" : "Add Task"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
