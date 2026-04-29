"use client";

import { useState, useEffect } from "react";
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
import ChipSelect from "@/components/ui/chip-select";
import { STATUS_LIST } from "@/lib/constants";
import type { Task, TaskStatus } from "@/types";

const statusOptions = STATUS_LIST.map((s) => s.value);
const statusLabelMap = Object.fromEntries(
  STATUS_LIST.map((s) => [s.value, s.label])
) as Record<TaskStatus, string>;

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

  // Sync form fields when the dialog opens or the editing target changes
  useEffect(() => {
    if (!open) return;
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
      onTaskUpdated?.({ ...editingTask, title: trimmed, description: description.trim(), status });
    } else {
      onTaskCreated({
        id: uuidv4(),
        projectSlug,
        title: trimmed,
        description: description.trim(),
        status,
        createdAt: new Date().toISOString(),
      });
    }
    handleClose(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-surface border border-amber-200 rounded-2xl text-stone-800 max-w-md p-0 gap-0 overflow-hidden shadow-2xl shadow-amber-200/30">
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

          <div className="space-y-6">
            <div className="space-y-3">
              <Label className="text-sm uppercase tracking-[0.12em] font-bold text-stone-500">
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
                className="bg-amber-50/50 border-amber-200 rounded-xl text-stone-800 placeholder:text-stone-400 focus-visible:ring-2 focus-visible:ring-[#FF5500]/30 focus-visible:border-[#FF5500] text-base h-12 px-4 transition-all"
              />
              {error && (
                <p className="text-sm text-red-500 font-medium">{error}</p>
              )}
            </div>

            <div className="space-y-3">
              <Label className="text-sm uppercase tracking-[0.12em] font-bold text-stone-500">
                Description{" "}
                <span className="text-stone-300 normal-case tracking-normal">
                  (optional)
                </span>
              </Label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add some details…"
                rows={3}
                className="w-full bg-amber-50/50 border border-amber-200 rounded-xl text-stone-800 placeholder:text-stone-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5500]/30 focus-visible:border-[#FF5500] text-base px-4 py-3 transition-all resize-none"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-sm uppercase tracking-[0.12em] font-bold text-stone-500">
                Status
              </Label>
              <ChipSelect
                options={statusOptions}
                value={status}
                onChange={(v) => setStatus(v as TaskStatus)}
                renderLabel={(v) => statusLabelMap[v as TaskStatus] ?? v}
              />
            </div>
          </div>

          <DialogFooter className="mt-8 flex flex-row gap-3 sm:gap-3">
            <Button
              variant="brand-outline"
              type="button"
              onClick={() => handleClose(false)}
              className="flex-1 h-12 text-base"
            >
              Cancel
            </Button>
            <Button
              variant="brand"
              type="button"
              onClick={handleSubmit}
              className="flex-1 h-12 text-base rounded-xl"
            >
              {isEditing ? "Save Changes" : "Add Task"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
