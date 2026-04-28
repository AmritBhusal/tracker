"use client";

import React, { useState } from "react";
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

const STORAGE_KEY = "taskboard_projects";

const TAGS = [
  "Design",
  "Engineering",
  "Marketing",
  "Product",
  "Research",
  "Other",
];

export type Project = {
  id: string;
  name: string;
  slug: string;
  tag: string;
  createdAt: string;
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProjectCreated: (project: Project) => void;
};

export default function CreateProjectDialog({
  open,
  onOpenChange,
  onProjectCreated,
}: Props) {
  const router = useRouter();
  const [projectName, setProjectName] = useState("");
  const [selectedTag, setSelectedTag] = useState("Engineering");
  const [error, setError] = useState("");

  const handleClose = (open: boolean) => {
    if (!open) {
      setProjectName("");
      setSelectedTag("Engineering");
      setError("");
    }
    onOpenChange(open);
  };

  const handleCreate = () => {
    const trimmed = projectName.trim();
    if (!trimmed) {
      setError("Project name cannot be empty.");
      return;
    }

    const slug = trimmed
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    const newProject: Project = {
      id: uuidv4(),
      name: trimmed,
      slug,
      tag: selectedTag,
      createdAt: new Date().toISOString(),
    };

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const existing: Project[] = raw ? JSON.parse(raw) : [];
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify([...existing, newProject]),
      );
    } catch {
      // fail silently
    }

    onProjectCreated(newProject);
    handleClose(false);
    router.push(`/tasks/${slug}`);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-white border border-stone-200 rounded-2xl text-stone-800 max-w-md p-0 gap-0 overflow-hidden shadow-2xl shadow-stone-200/50">
        {/* Top accent bar */}
        <div className="h-1.5 w-full bg-[#FF5500]" />

        <div className="px-8 pt-7 pb-8">
          <DialogHeader className="mb-7">
            <DialogTitle className="text-2xl font-bold tracking-tight text-stone-800">
              New Project
            </DialogTitle>
            <DialogDescription className="text-stone-500 text-sm mt-1.5">
              Give your project a name and a category.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Name */}
            <div className="space-y-2.5">
              <Label className="text-[11px] uppercase tracking-[0.15em] font-bold text-stone-400">
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
                className="bg-stone-50 border-stone-200 rounded-xl text-stone-800 placeholder:text-stone-400 focus-visible:ring-2 focus-visible:ring-[#FF5500]/30 focus-visible:border-[#FF5500] text-sm h-11 px-4 transition-all"
              />
              {error && (
                <p className="text-xs text-red-500 font-medium">{error}</p>
              )}
            </div>

            {/* Tag */}
            <div className="space-y-3">
              <Label className="text-[11px] uppercase tracking-[0.15em] font-bold text-stone-400">
                Category
              </Label>
              <div className="flex flex-wrap gap-2.5">
                {TAGS.map((tag) => {
                  const isSelected = selectedTag === tag;
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setSelectedTag(tag)}
                      className={`px-3.5 py-2 text-[11px] uppercase tracking-wider font-semibold rounded-xl border transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? "bg-[#FF5500] text-white border-transparent shadow-md shadow-[#FF5500]/20"
                          : "bg-stone-50 text-stone-500 border-stone-200 hover:bg-[#FF5500]/5 hover:text-[#FF5500] hover:border-[#FF5500]/30"
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <DialogFooter className="mt-8 flex flex-row gap-3 sm:gap-3">
            <Button
              type="button"
              onClick={() => handleClose(false)}
              className="flex-1 rounded-xl text-sm font-medium bg-stone-100 text-stone-600 border border-stone-200 hover:bg-stone-200 hover:text-stone-800 cursor-pointer h-11 transition-all duration-200"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleCreate}
              className="flex-1 bg-[#FF5500] hover:bg-[#E04A00] text-white rounded-xl text-sm font-semibold cursor-pointer h-11 border-0 shadow-lg shadow-[#FF5500]/20 hover:shadow-[#FF5500]/30 transition-all duration-300"
            >
              Create Project
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
