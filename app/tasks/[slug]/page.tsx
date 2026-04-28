"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Board from "@/components/Tasks/Board";
import CreateTaskDialog, {
  type Task,
  type TaskStatus,
} from "@/components/Tasks/CreateTaskDialog";

const PROJECTS_KEY = "taskboard_projects";
const TASKS_KEY = "taskboard_tasks";

type Project = {
  id: string;
  name: string;
  slug: string;
  tag: string;
  createdAt: string;
};

export default function TasksPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogDefaultStatus, setDialogDefaultStatus] =
    useState<TaskStatus>("todo");
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Load project and tasks from localStorage
  useEffect(() => {
    try {
      const rawProjects = localStorage.getItem(PROJECTS_KEY);
      if (rawProjects) {
        const projects: Project[] = JSON.parse(rawProjects);
        const found = projects.find((p) => p.slug === slug);
        if (found) setProject(found);
      }
    } catch {
      /* ignore */
    }

    try {
      const rawTasks = localStorage.getItem(TASKS_KEY);
      if (rawTasks) {
        const allTasks: Task[] = JSON.parse(rawTasks);
        setTasks(allTasks.filter((t) => t.projectSlug === slug));
      }
    } catch {
      /* ignore */
    }
  }, [slug]);

  // Persist tasks helper
  const persistTasks = (updatedProjectTasks: Task[]) => {
    try {
      const rawTasks = localStorage.getItem(TASKS_KEY);
      const allTasks: Task[] = rawTasks ? JSON.parse(rawTasks) : [];
      // Remove old tasks for this project, then add the updated ones
      const otherTasks = allTasks.filter((t) => t.projectSlug !== slug);
      localStorage.setItem(
        TASKS_KEY,
        JSON.stringify([...otherTasks, ...updatedProjectTasks])
      );
    } catch {
      /* ignore */
    }
  };

  const handleTaskCreated = (task: Task) => {
    const updated = [...tasks, task];
    setTasks(updated);
    persistTasks(updated);
  };

  const handleTaskUpdated = (updatedTask: Task) => {
    const updated = tasks.map((t) =>
      t.id === updatedTask.id ? updatedTask : t
    );
    setTasks(updated);
    persistTasks(updated);
  };

  const openDialogForColumn = (status: TaskStatus) => {
    setEditingTask(null);
    setDialogDefaultStatus(status);
    setDialogOpen(true);
  };

  const openDialogFromTop = () => {
    setEditingTask(null);
    setDialogDefaultStatus("todo");
    setDialogOpen(true);
  };

  const openEditDialog = (task: Task) => {
    setEditingTask(task);
    setDialogDefaultStatus(task.status);
    setDialogOpen(true);
  };

  return (
    <div className="max-w-6xl mx-auto px-8 py-10">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-stone-400 hover:text-[#FF5500] transition-colors mb-3 group"
          >
            <ArrowLeft
              size={14}
              className="group-hover:-translate-x-0.5 transition-transform"
            />
            Back to Projects
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-stone-800">
            {project ? project.name : "Project"}
          </h1>
          {project && (
            <div className="flex items-center gap-3 mt-2.5">
              <span className="inline-block px-3 py-1 rounded-lg bg-[#FF5500]/5 text-[#FF5500] text-xs uppercase tracking-wider font-semibold border border-[#FF5500]/15">
                {project.tag}
              </span>
              <span className="text-sm text-stone-500">
                {tasks.length} task{tasks.length !== 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>
        <Button
          onClick={openDialogFromTop}
          className="bg-[#FF5500] hover:bg-[#E04A00] text-white rounded-2xl text-sm font-semibold gap-2 px-6 py-2.5 cursor-pointer border-0 shadow-lg shadow-[#FF5500]/20 hover:shadow-[#FF5500]/30 transition-all duration-300"
        >
          <Plus size={15} strokeWidth={2.5} />
          Add Task
        </Button>
      </div>

      {/* Board */}
      <Board
        tasks={tasks}
        onAddToColumn={openDialogForColumn}
        onEditTask={openEditDialog}
      />

      {/* Dialog (create or edit) */}
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