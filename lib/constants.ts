import type { TaskStatus } from "@/types";

export const STORAGE_KEYS = {
  PROJECTS: "taskboard_projects",
  TASKS: "taskboard_tasks",
} as const;

export type StatusConfig = {
  value: TaskStatus;
  label: string;
};

export const STATUS_LIST: StatusConfig[] = [
  { value: "todo", label: "To Do" },
  { value: "in-progress", label: "In Progress" },
  { value: "done", label: "Done" },
];

export const STATUS_LABELS: Record<TaskStatus, string> = Object.fromEntries(
  STATUS_LIST.map((s) => [s.value, s.label])
) as Record<TaskStatus, string>;

export const STATUS_ORDER: TaskStatus[] = STATUS_LIST.map((s) => s.value);

export const PROJECT_TAGS = [
  "Design",
  "Engineering",
  "Marketing",
  "Product",
  "Research",
  "Other",
] as const;
