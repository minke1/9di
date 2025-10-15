export interface Todo {
    id: number;
    created_at: string;
    title: string | null;
    content: string | null;
    start_date: string | null;
    end_date: string | null;
}