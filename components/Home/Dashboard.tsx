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

function getLastUpdatedLabel(projects: Project[]): string {
  if (projects.length === 0) return "";
  const latest = projects.reduce((a, b) =>
    a.createdAt > b.createdAt ? a : b
  );
  const daysAgo = Math.floor(
    (Date.now() - new Date(latest.createdAt).getTime()) / 86_400_000
  );
  if (daysAgo === 0) return "updated today";
  if (daysAgo === 1) return "updated yesterday";
  return `updated ${daysAgo}d ago`;
}

export default function Dashboard({ projects, onNewProject }: Props) {
  const isEmpty = projects.length === 0;
  const [allTasks] = useLocalStorage<Task[]>(STORAGE_KEYS.TASKS, []);

  const completedTasks = allTasks.filter((t) => t.status === "done").length;

  const stats = [
    { label: "Projects", value: projects.length, icon: Layers, color: "text-[#FF5500]" },
    { label: "Total Tasks", value: allTasks.length, icon: CheckCircle2, color: "text-sky-500" },
    { label: "Completed", value: completedTasks, icon: CheckCircle2, color: "text-emerald-500" },
  ];

  return (
    <div className="max-w-4xl mx-auto px-8 py-14">
      <div className="flex items-end justify-between mb-12">
        <div>
          <h1 className="text-5xl font-bold tracking-tight leading-none text-stone-800">
            My <span className="text-[#FF5500]">Projects</span>
          </h1>
          <p className="text-base text-stone-500 mt-3">
            {isEmpty
              ? "No projects yet — create your first one below"
              : `${projects.length} project${projects.length > 1 ? "s" : ""} · ${getLastUpdatedLabel(projects)}`}
          </p>
        </div>
        <Button
          variant="brand"
          onClick={onNewProject}
          className="gap-2 px-7 py-3 text-base"
        >
          <Plus size={17} strokeWidth={2.5} />
          New Project
        </Button>
      </div>

      {isEmpty ? (
        <div className="border-2 border-dashed border-amber-200 rounded-3xl flex flex-col items-center justify-center py-24 gap-6 bg-surface">
          <div className="w-20 h-20 rounded-2xl bg-[#FF5500]/5 border border-[#FF5500]/10 flex items-center justify-center">
            <FolderOpen size={30} className="text-[#FF5500]" />
          </div>
          <div className="text-center space-y-2.5">
            <p className="text-stone-800 text-2xl font-semibold tracking-tight">
              Nothing here yet.
            </p>
            <p className="text-stone-500 text-base max-w-xs leading-relaxed">
              Projects keep your tasks organised by goal or team. Create your
              first one to get started.
            </p>
          </div>
          <Button
            variant="brand"
            onClick={onNewProject}
            className="mt-2 gap-2 px-7 py-3 text-base"
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {projects.map((project) => {
              const taskCount = allTasks.filter(
                (t) => t.projectSlug === project.slug
              ).length;
              return (
                <Link key={project.id} href={`/tasks/${project.slug}`}>
                  <div className="relative bg-surface rounded-2xl p-7 cursor-pointer hover:shadow-lg transition-all duration-300 min-h-[170px] flex flex-col justify-between group overflow-hidden shadow-sm">
                    <div className="flex items-start justify-between">
                      <span className="text-xl font-semibold leading-snug tracking-tight text-stone-800 pr-3">
                        {project.name}
                      </span>
                      <div className="w-3 h-3 rounded-full mt-1.5 flex-shrink-0 bg-emerald-400 shadow-sm shadow-emerald-200" />
                    </div>

                    <div className="flex items-end justify-between mt-5">
                      <div className="space-y-3">
                        <p className="text-base text-stone-500">
                          <span className="text-stone-800 font-semibold">
                            {taskCount}
                          </span>{" "}
                          task{taskCount !== 1 ? "s" : ""}
                        </p>
                        <span className="inline-block px-3.5 py-1.5 rounded-lg bg-[#FF5500]/5 text-[#FF5500] text-xs uppercase tracking-wider font-semibold border border-[#FF5500]/15">
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

          {/* Quick stats at a glance */}
          <div className="grid grid-cols-3 gap-5 mt-10">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-surface border border-amber-200/80 rounded-2xl px-6 py-5 hover:shadow-md transition-all duration-300 shadow-sm shadow-amber-100/50"
              >
                <div className="flex items-center gap-2.5 mb-2.5">
                  <stat.icon size={16} className={stat.color} />
                  <span className="text-xs uppercase tracking-[0.12em] font-bold text-stone-400">
                    {stat.label}
                  </span>
                </div>
                <div className="text-4xl font-bold tracking-tight text-stone-800">
                  {stat.value}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
