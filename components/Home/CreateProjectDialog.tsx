"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { PROJECT_TAGS } from "@/lib/constants";
import type { Project } from "@/types";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProjectCreated: (project: Project) => void;
  existingProjects: Project[];
};

export default function CreateProjectDialog({
  open,
  onOpenChange,
  onProjectCreated,
  existingProjects,
}: Props) {
  const router = useRouter();
  const [projectName, setProjectName] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>("Engineering");
  const [error, setError] = useState("");

  function resetForm() {
    setProjectName("");
    setSelectedTag("Engineering");
    setError("");
  }

  function handleClose(isOpen: boolean) {
    if (!isOpen) resetForm();
    onOpenChange(isOpen);
  }

  function handleCreate() {
    const trimmed = projectName.trim();
    if (!trimmed) {
      setError("Project name cannot be empty.");
      return;
    }

    // Build a URL-safe slug, appending a number if it's already taken
    const base = trimmed
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    const taken = new Set(existingProjects.map((p) => p.slug));
    let slug = base;
    let n = 1;
    while (taken.has(slug)) {
      slug = `${base}-${n++}`;
    }

    const project: Project = {
      id: uuidv4(),
      name: trimmed,
      slug,
      tag: selectedTag,
      createdAt: new Date().toISOString(),
    };

    onProjectCreated(project);
    handleClose(false);
    router.push(`/tasks/${slug}`);
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-surface border border-amber-200 rounded-2xl text-stone-800 max-w-[calc(100vw-2rem)] sm:max-w-md p-0 gap-0 overflow-hidden shadow-2xl shadow-amber-200/30">
        <div className="h-1.5 w-full bg-[#FF5500]" />
        <div className="px-5 sm:px-8 pt-5 sm:pt-7 pb-6 sm:pb-8">
          <DialogHeader className="mb-5 sm:mb-7">
            <DialogTitle className="text-xl sm:text-2xl font-bold tracking-tight text-stone-800">
              New Project
            </DialogTitle>
            <DialogDescription className="text-stone-500 text-sm sm:text-base mt-1.5">
              Give your project a name and a category.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 sm:space-y-6">
            <div className="space-y-2.5 sm:space-y-3">
              <Label className="text-sm uppercase tracking-[0.12em] font-bold text-stone-500">
                Project Name
              </Label>
              <Input
                autoFocus
                value={projectName}
                onChange={(e) => {
                  setProjectName(e.target.value);
                  setError("");
                }}
                onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                placeholder="e.g. Website Redesign"
                className="bg-amber-50/50 border-amber-200 rounded-xl text-stone-800 placeholder:text-stone-400 focus-visible:ring-2 focus-visible:ring-[#FF5500]/30 focus-visible:border-[#FF5500] text-sm sm:text-base h-11 sm:h-12 px-4 transition-all"
              />
              {error && (
                <p className="text-sm text-red-500 font-medium">{error}</p>
              )}
            </div>

            <div className="space-y-2.5 sm:space-y-3">
              <Label className="text-sm uppercase tracking-[0.12em] font-bold text-stone-500">
                Category
              </Label>
              <ChipSelect
                options={PROJECT_TAGS}
                value={selectedTag}
                onChange={setSelectedTag}
              />
            </div>
          </div>

          <DialogFooter className="mt-6 sm:mt-8 flex flex-row gap-3">
            <Button
              variant="brand-outline"
              type="button"
              onClick={() => handleClose(false)}
              className="flex-1 h-11 sm:h-12 text-sm sm:text-base"
            >
              Cancel
            </Button>
            <Button
              variant="brand"
              type="button"
              onClick={handleCreate}
              className="flex-1 h-11 sm:h-12 text-sm sm:text-base rounded-xl"
            >
              Create Project
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
