export interface Task {
    id?: number;
    title: string;
    description: string;
    status: string;
    due_date: string | null;
    created_at: Date | string;
}

// For creating a new task, you might not want to include created_at
export type NewTask = Omit<Task, "id" | "created_at">;
