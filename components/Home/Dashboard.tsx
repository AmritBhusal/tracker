"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight, FolderOpen, Plus, Layers, CheckCircle2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Project } from "./CreateProjectDialog";

type Props = {
  projects: Project[];
  onNewProject: () => void;
};

export default function Dashboard({ projects, onNewProject }: Props) {
  const isEmpty = projects.length === 0;

  const [allTasks, setAllTasks] = React.useState<
    { id: string; projectSlug: string; status: string }[]
  >([]);

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem("taskboard_tasks");
      if (raw) setAllTasks(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  const totalTasks = allTasks.length;
  const completedTasks = allTasks.filter((t) => t.status === "done").length;

  const stats = [
    { label: "Projects", value: projects.length, icon: Layers, color: "text-[#FF5500]" },
    { label: "Total Tasks", value: totalTasks, icon: CheckCircle2, color: "text-sky-500" },
    { label: "Completed", value: completedTasks, icon: CheckCircle2, color: "text-emerald-500" },
    { label: "Due Today", value: 0, icon: Clock, color: "text-amber-500" },
  ];

  return (
    <div className="max-w-4xl mx-auto px-8 py-12">
      {/* Page Header */}
      <div className="flex items-end justify-between mb-10">
        <div>
          <h1 className="text-4xl font-bold tracking-tight leading-none text-stone-800">
            My{" "}
            <span className="text-[#FF5500]">
              Projects
            </span>
          </h1>
          <p className="text-sm text-stone-500 mt-2.5">
            {isEmpty
              ? "No projects yet — create your first one below"
              : `${projects.length} project${projects.length > 1 ? "s" : ""} · last updated today`}
          </p>
        </div>
        <Button
          onClick={onNewProject}
          className="bg-[#FF5500] hover:bg-[#E04A00] text-white rounded-2xl text-sm font-semibold gap-2 px-6 py-2.5 cursor-pointer border-0 shadow-lg shadow-[#FF5500]/20 hover:shadow-[#FF5500]/30 transition-all duration-300"
        >
          <Plus size={15} strokeWidth={2.5} />
          New Project
        </Button>
      </div>

      {/* Empty State */}
      {isEmpty ? (
        <div className="border-2 border-dashed border-stone-200 rounded-3xl flex flex-col items-center justify-center py-24 gap-6 bg-white">
          <div className="w-20 h-20 rounded-2xl bg-[#FF5500]/5 border border-[#FF5500]/10 flex items-center justify-center">
            <FolderOpen size={28} className="text-[#FF5500]" />
          </div>
          <div className="text-center space-y-2">
            <p className="text-stone-800 text-xl font-semibold tracking-tight">
              Nothing here yet.
            </p>
            <p className="text-stone-500 text-sm max-w-xs leading-relaxed">
              Projects keep your tasks organised by goal or team. Create your
              first one to get started.
            </p>
          </div>
          <button
            onClick={onNewProject}
            className="mt-2 inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-[#FF5500] hover:bg-[#E04A00] text-white text-sm font-semibold shadow-lg shadow-[#FF5500]/20 hover:shadow-[#FF5500]/30 transition-all duration-300 cursor-pointer"
          >
            <Plus size={15} strokeWidth={2.5} />
            Create your first project
          </button>
        </div>
      ) : (
        <>
          <p className="text-[11px] uppercase tracking-[0.15em] font-bold text-stone-400 mb-4">
            All Projects
          </p>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {projects.map((project) => (
              <Link key={project.id} href={`/tasks/${project.slug}`}>
                <div className="relative bg-white border border-stone-200/80 rounded-2xl p-6 cursor-pointer hover:border-[#FF5500]/30 hover:shadow-lg hover:shadow-[#FF5500]/5 transition-all duration-300 min-h-[160px] flex flex-col justify-between group overflow-hidden">
                  {/* Hover accent bar */}
                  <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#FF5500] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-2xl" />

                  <div className="flex items-start justify-between">
                    <span className="text-lg font-semibold leading-snug tracking-tight text-stone-800 pr-3">
                      {project.name}
                    </span>
                    <div className="w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 bg-emerald-400 shadow-sm shadow-emerald-200" />
                  </div>

                  <div className="flex items-end justify-between mt-5">
                    <div className="space-y-2.5">
                      <p className="text-sm text-stone-500">
                        <span className="text-stone-800 font-semibold">
                          {allTasks.filter((t) => t.projectSlug === project.slug).length}
                        </span>{" "}
                        tasks
                      </p>
                      <span className="inline-block px-3 py-1 rounded-lg bg-[#FF5500]/5 text-[#FF5500] text-[11px] uppercase tracking-wider font-semibold border border-[#FF5500]/15">
                        {project.tag}
                      </span>
                    </div>
                    <ArrowUpRight
                      size={20}
                      className="text-stone-300 group-hover:text-[#FF5500] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300"
                    />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-white border border-stone-200/80 rounded-2xl px-5 py-4 hover:shadow-md hover:shadow-[#FF5500]/5 transition-all duration-300"
              >
                <div className="flex items-center gap-2 mb-2">
                  <stat.icon size={14} className={stat.color} />
                  <span className="text-[11px] uppercase tracking-[0.12em] font-bold text-stone-400">
                    {stat.label}
                  </span>
                </div>
                <div className="text-3xl font-bold tracking-tight text-stone-800">
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
