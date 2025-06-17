export type TaskState = "todo" | "doing" | "done";
export type TaskPriority = "niski" | "sredni" | "wysoki";

export interface Task {
  id: string;
  name: string;
  description: string;
  priority: TaskPriority;
  storyId: string;
  estimatedHours: number;
  state: TaskState;
  createdAt: string;
  startedAt?: string;
  finishedAt?: string;
  assigneeId?: string;
  spentHours?: number;
}
