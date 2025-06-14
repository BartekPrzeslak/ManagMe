export type StoryState = "todo" | "doing" | "done";
export type StoryPriority = "niski" | "sredni" | "wysoki";

export interface Story {
    id: string;
    name: string;
    description: string;
    priority: StoryPriority;
    projectId: string;
    createdAt: string;
    state: StoryState;
    ownerId: string;
    
}