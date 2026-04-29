
export type TaskStatus = "todo" | "in-progress" | "done";

export type Task = {
  id: string;
  projectSlug: string;
  title: string;
  description: string;
  status: TaskStatus;
  createdAt: string;
};

export type Project = {
  id: string;
  name: string;
  slug: string;
  tag: string;
  createdAt: string;
};
