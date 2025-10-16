export interface Todo {
    id: number;
    created_at: string;
    title: string | null;
    content: BoardContent[] | null;
    start_date: string | null;
    end_date: string | null;
}


export interface BoardContent {
    boardId : string | number;
    isConmpleted : boolean;
    title:string;
    startDate:string | Date;
    endDate:string | Date;
    content:string;
}