"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Board from "@/components/Tasks/Board";
import CreateTaskDialog from "@/components/Tasks/CreateTaskDialog";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { STORAGE_KEYS } from "@/lib/constants";
import type { Project, Task, TaskStatus } from "@/types";

import { use } from "react";

export default function TasksPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);

  const [projects] = useLocalStorage<Project[]>(STORAGE_KEYS.PROJECTS, []);
  const [allTasks, setAllTasks] = useLocalStorage<Task[]>(STORAGE_KEYS.TASKS, []);

  const project = useMemo(
    () => projects.find((p) => p.slug === slug) ?? null,
    [projects, slug]
  );

  const tasks = useMemo(
    () => allTasks.filter((t) => t.projectSlug === slug),
    [allTasks, slug]
  );

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogDefaultStatus, setDialogDefaultStatus] = useState<TaskStatus>("todo");
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter tasks when the user types something in the search box
  const filteredTasks = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return tasks;
    return tasks.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q)
    );
  }, [tasks, searchQuery]);

  const handleTaskCreated = useCallback(
    (task: Task) => setAllTasks((prev) => [...prev, task]),
    [setAllTasks]
  );

  const handleTaskUpdated = useCallback(
    (updated: Task) =>
      setAllTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t))),
    [setAllTasks]
  );

  const handleTaskMoved = useCallback(
    (task: Task, newStatus: TaskStatus) =>
      setAllTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, status: newStatus } : t))
      ),
    [setAllTasks]
  );

  const handleTaskDeleted = useCallback(
    (task: Task) => setAllTasks((prev) => prev.filter((t) => t.id !== task.id)),
    [setAllTasks]
  );

  const openDialog = (status: TaskStatus, task: Task | null = null) => {
    setEditingTask(task);
    setDialogDefaultStatus(task?.status ?? status);
    setDialogOpen(true);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-6 sm:py-12">
      {/* Header area — collapses to a single column on phones */}
      <div className="flex flex-col gap-4 mb-6 sm:mb-10">
        {/* Top row: back link + project info */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm sm:text-base font-medium text-stone-400 hover:text-[#FF5500] transition-colors mb-3 sm:mb-4 group"
          >
            <ArrowLeft
              size={16}
              className="group-hover:-translate-x-0.5 transition-transform"
            />
            Back to Projects
          </Link>
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-stone-800">
            {project ? project.name : "Project"}
          </h1>
          {project && (
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3.5 mt-2 sm:mt-3">
              <span className="inline-block px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-lg bg-[#FF5500]/5 text-[#FF5500] text-xs sm:text-sm uppercase tracking-wider font-semibold border border-[#FF5500]/15">
                {project.tag}
              </span>
              <span className="text-sm sm:text-base text-stone-500">
                {tasks.length} task{tasks.length !== 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>

        {/* Search + Add button row */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-3">
          <div className="relative flex-1 sm:flex-none">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks..."
              className="pl-9 h-11 sm:h-12 w-full sm:w-64 bg-surface border-amber-200/80 rounded-xl text-stone-800 placeholder:text-stone-400 focus-visible:ring-2 focus-visible:ring-[#FF5500]/30 focus-visible:border-[#FF5500] shadow-sm shadow-amber-100/40"
            />
          </div>
          <Button
            variant="brand"
            onClick={() => openDialog("todo")}
            className="gap-2 px-5 sm:px-7 py-3 text-sm sm:text-base h-11 sm:h-12"
          >
            <Plus size={17} strokeWidth={2.5} />
            Add Task
          </Button>
        </div>
      </div>

      <Board
        tasks={filteredTasks}
        onAddToColumn={(status) => openDialog(status)}
        onEditTask={(task) => openDialog(task.status, task)}
        onMoveTask={handleTaskMoved}
        onDeleteTask={handleTaskDeleted}
      />

      <CreateTaskDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onTaskCreated={handleTaskCreated}
        onTaskUpdated={handleTaskUpdated}
        projectSlug={slug}
        defaultStatus={dialogDefaultStatus}
        editingTask={editingTask}
      />
    </div>
  );
}