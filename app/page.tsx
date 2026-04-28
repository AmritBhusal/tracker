"use client";

import React, { useState, useEffect } from "react";
import CreateProjectDialog, { type Project } from "@/components/Home/CreateProjectDialog";
import Dashboard from "@/components/Home/Dashboard";

const STORAGE_KEY = "taskboard_projects";

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setProjects(JSON.parse(raw));
    } catch {
      setProjects([]);
    }
  }, []);

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
      />
    </>
  );
}