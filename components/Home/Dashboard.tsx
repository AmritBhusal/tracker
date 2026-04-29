"use client";

import Link from "next/link";
import { ArrowUpRight, FolderOpen, Plus, Layers, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { STORAGE_KEYS } from "@/lib/constants";
import type { Project, Task } from "@/types";

type Props = {
  projects: Project[];
  onNewProject: () => void;
};

// Figures out a readable "last updated" label from the most recent project
function getLastUpdatedLabel(projects: Project[]): string {
  if (!projects.length) return "";

  const latest = projects.reduce((a, b) =>
    a.createdAt > b.createdAt ? a : b
  );
  const msPerDay = 86_400_000;
  const daysAgo = Math.floor(
    (Date.now() - new Date(latest.createdAt).getTime()) / msPerDay
  );

  if (daysAgo === 0) return "updated today";
  if (daysAgo === 1) return "updated yesterday";
  return `updated ${daysAgo}d ago`;
}

export default function Dashboard({ projects, onNewProject }: Props) {
  const isEmpty = projects.length === 0;
  const [allTasks] = useLocalStorage<Task[]>(STORAGE_KEYS.TASKS, []);

  const doneCount = allTasks.filter((t) => t.status === "done").length;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8 sm:py-14">
      {/* Page header — stacks vertically on mobile */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-12">
        <div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight leading-none text-stone-800">
            My <span className="text-[#FF5500]">Projects</span>
          </h1>
          <p className="text-sm sm:text-base text-stone-500 mt-2 sm:mt-3">
            {isEmpty
              ? "No projects yet — create your first one below"
              : `${projects.length} project${projects.length > 1 ? "s" : ""} · ${getLastUpdatedLabel(projects)}`}
          </p>
        </div>
        <Button
          variant="brand"
          onClick={onNewProject}
          className="gap-2 px-5 sm:px-7 py-3 text-sm sm:text-base self-start sm:self-auto"
        >
          <Plus size={17} strokeWidth={2.5} />
          New Project
        </Button>
      </div>

      {isEmpty ? (
        <div className="border-2 border-dashed border-amber-200 rounded-3xl flex flex-col items-center justify-center py-16 sm:py-24 gap-5 sm:gap-6 bg-surface px-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#FF5500]/5 border border-[#FF5500]/10 flex items-center justify-center">
            <FolderOpen size={28} className="text-[#FF5500]" />
          </div>
          <div className="text-center space-y-2">
            <p className="text-stone-800 text-xl sm:text-2xl font-semibold tracking-tight">
              Nothing here yet.
            </p>
            <p className="text-stone-500 text-sm sm:text-base max-w-xs leading-relaxed">
              Projects keep your tasks organised by goal or team. Create your
              first one to get started.
            </p>
          </div>
          <Button
            variant="brand"
            onClick={onNewProject}
            className="mt-2 gap-2 px-5 sm:px-7 py-3 text-sm sm:text-base"
          >
            <Plus size={17} strokeWidth={2.5} />
            Create your first project
          </Button>
        </div>
      ) : (
        <>
          <p className="text-xs uppercase tracking-[0.15em] font-bold text-stone-400 mb-5">
            All Projects
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {projects.map((project) => {
              const taskCount = allTasks.filter(
                (t) => t.projectSlug === project.slug
              ).length;

              return (
                <Link key={project.id} href={`/tasks/${project.slug}`}>
                  <div className="relative bg-surface rounded-2xl p-5 sm:p-7 cursor-pointer hover:shadow-lg transition-all duration-300 min-h-[150px] sm:min-h-[170px] flex flex-col justify-between group overflow-hidden shadow-sm">
                    <div className="flex items-start justify-between">
                      <span className="text-lg sm:text-xl font-semibold leading-snug tracking-tight text-stone-800 pr-3">
                        {project.name}
                      </span>
                      <div className="w-3 h-3 rounded-full mt-1.5 flex-shrink-0 bg-emerald-400 shadow-sm shadow-emerald-200" />
                    </div>

                    <div className="flex items-end justify-between mt-4 sm:mt-5">
                      <div className="space-y-2 sm:space-y-3">
                        <p className="text-sm sm:text-base text-stone-500">
                          <span className="text-stone-800 font-semibold">
                            {taskCount}
                          </span>{" "}
                          task{taskCount !== 1 ? "s" : ""}
                        </p>
                        <span className="inline-block px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-lg bg-[#FF5500]/5 text-[#FF5500] text-xs uppercase tracking-wider font-semibold border border-[#FF5500]/15">
                          {project.tag}
                        </span>
                      </div>
                      <ArrowUpRight
                        size={22}
                        className="text-stone-300 group-hover:text-[#FF5500] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300"
                      />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Quick stats — single col on mobile, 3 across on larger screens */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 mt-8 sm:mt-10">
            <StatCard
              icon={Layers}
              iconColor="text-[#FF5500]"
              label="Projects"
              value={projects.length}
            />
            <StatCard
              icon={CheckCircle2}
              iconColor="text-sky-500"
              label="Total Tasks"
              value={allTasks.length}
            />
            <StatCard
              icon={CheckCircle2}
              iconColor="text-emerald-500"
              label="Completed"
              value={doneCount}
            />
          </div>
        </>
      )}
    </div>
  );
}

/**
 * Small presentational card for a single stat.
 * Pulled out to avoid repeating the same markup three times inline.
 */
function StatCard({
  icon: Icon,
  iconColor,
  label,
  value,
}: {
  icon: React.ElementType;
  iconColor: string;
  label: string;
  value: number;
}) {
  return (
    <div className="bg-surface border border-amber-200/80 rounded-2xl px-5 sm:px-6 py-4 sm:py-5 hover:shadow-md transition-all duration-300 shadow-sm shadow-amber-100/50">
      <div className="flex items-center gap-2.5 mb-2">
        <Icon size={16} className={iconColor} />
        <span className="text-xs uppercase tracking-[0.12em] font-bold text-stone-400">
          {label}
        </span>
      </div>
      <div className="text-3xl sm:text-4xl font-bold tracking-tight text-stone-800">
        {value}
      </div>
    </div>
  );
}
