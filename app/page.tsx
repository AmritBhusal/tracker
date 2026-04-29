"use client";

import { useState } from "react";
import CreateProjectDialog from "@/components/Home/CreateProjectDialog";
import Dashboard from "@/components/Home/Dashboard";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { STORAGE_KEYS } from "@/lib/constants";
import type { Project } from "@/types";

export default function Home() {
  const [projects, setProjects] = useLocalStorage<Project[]>(
    STORAGE_KEYS.PROJECTS,
    []
  );
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleProjectCreated = (project: Project) => {
    setProjects((prev) => [...prev, project]);
  };

  return (
    <>
      <Dashboard
        projects={projects}
        onNewProject={() => setDialogOpen(true)}
      />

      <CreateProjectDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onProjectCreated={handleProjectCreated}
        existingProjects={projects}
      />
    </>
  );
}