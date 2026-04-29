"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
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
    <div className="max-w-6xl mx-auto px-8 py-12">
      <div className="flex items-start justify-between mb-10">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-base font-medium text-stone-400 hover:text-[#FF5500] transition-colors mb-4 group"
          >
            <ArrowLeft
              size={16}
              className="group-hover:-translate-x-0.5 transition-transform"
            />
            Back to Projects
          </Link>
          <h1 className="text-4xl font-bold tracking-tight text-stone-800">
            {project ? project.name : "Project"}
          </h1>
          {project && (
            <div className="flex items-center gap-3.5 mt-3">
              <span className="inline-block px-3.5 py-1.5 rounded-lg bg-[#FF5500]/5 text-[#FF5500] text-sm uppercase tracking-wider font-semibold border border-[#FF5500]/15">
                {project.tag}
              </span>
              <span className="text-base text-stone-500">
                {tasks.length} task{tasks.length !== 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>
        <Button
          variant="brand"
          onClick={() => openDialog("todo")}
          className="gap-2 px-7 py-3 text-base"
        >
          <Plus size={17} strokeWidth={2.5} />
          Add Task
        </Button>
      </div>

      <Board
        tasks={tasks}
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