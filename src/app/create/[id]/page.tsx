"use client";

import { Button } from "@/components/ui/button";
import styles from "./page.module.scss"
import LabelCalendar from "@/components/ui/common/calendar/LabelCalendar";
import { Progress } from "@/components/ui/progress"
import BasicBoard from "@/components/ui/common/board/basicBoard";
import {Todo, BoardContent} from "@/types/todos";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/utils/supabase";
import { nanoid } from "nanoid";

export default function Create() {

    const router = useRouter();
    const pathname = usePathname();
    
    const [boards, setBoards] = useState<Todo>();
    const [startDate, setStartDate] = useState<string | Date>();
    const [endDate, setEndDate] = useState<string | Date>();


    const insertRowData = async (content: BoardContent[]) => {

        const todoId = parseInt(pathname.split("/")[2]);

        if (boards?.content !== undefined){
            const {data, error, status} = await supabase.from("todos")
                                        .update({content: content})
                                        .eq("id", todoId)
            if(error){
                toast.error("Failed to insert data");
            }

            if(status === 200 || status === 204){
                toast.success("Data inserted successfully");
                getData();
            }
        }else {
            const {data, error, status} = await supabase.from("todos")
                                        .insert(
                                            {
                                             content: content
                                            },
                                        ).select();
            if(error){
                toast.error("Failed to insert data");
            }

            if(status === 201){
                toast.success("Data inserted successfully");
                getData();
            }
        }
    
       
    }



    const createBoard = async() => {

        let newContents: BoardContent[] = [];

        const BoardContent = {
            boardId: nanoid(),
            isConmpleted: false,
            title: "",
            startDate: "",
            endDate: "",
            content: ""
        }

        if(boards && boards.content?.length && boards.content.length > 0) {
            newContents = [...boards.content, BoardContent];
            insertRowData(newContents);

        }else if (boards && boards.content?.length === 0) {
            newContents.push(BoardContent);
            insertRowData(newContents);
        }
    }


    const getData = async () => {

        const todoId = parseInt(pathname.split("/")[2]);

        const {data, error, status} = await supabase.from("todos")
                                        .select("*")
                                        .eq("id", todoId)

        if(error){
            toast.error("Failed to get data");
            return;
        }

        if(status === 200){
            if(data && data.length > 0){
                setBoards(data[0]);
            } else {
                // 데이터가 없으면 빈 보드로 초기화
                setBoards({
                    id: todoId,
                    title: '',
                    content: [],
                    start_date: new Date().toISOString(),
                    end_date: new Date().toISOString(),
                    created_at: new Date().toISOString()
                } as Todo);
            }
        }
    }

    useEffect(() => {
        getData();
    }, []);

    return <div className={styles.container}>
                <header className={styles.container__header}>
                    <div className={styles.container__header__contents}>
                        <input type="text" placeholder="Enter the Title" className={styles.input}/>
                        <div className={styles.progressBar}>
                            <span className={styles.progressBar__status}>0/10 Complete</span>
                            <Progress value={33} className="w-[30%] h-2" indicatorColor="bg-orange-500" />
                        </div>
                        <div className={styles.calendarBox}>
                            <div className={styles.calendarBox__calendar}>
                                <LabelCalendar label="from"/>
                                <LabelCalendar label="to"/>
                            </div>
                            <Button variant="outline" className="w-[15%] text-black hover:bg-orange-50 border-orange-500
                                            hover:border-orange-50" onClick={createBoard}>Add New Board</Button>
                        </div>
                    </div>
                </header>
                <main className={styles.container__body}>
                    {
                    boards?.content?.length === 0 ? (
                        <div className={styles.container__body__infoBox}>
                            <span className={styles.title}>There is no page</span>
                            <span className={styles.subTitle}>Click Add New Page to create a new page</span>
                            <button className={styles.button}>Click</button>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-16 items-center justify-start w-full h-full">
                            {boards?.content?.map((item:BoardContent) => (
                                <BasicBoard key={item.boardId} />
                            ))}
                        </div>
                    )}
                </main>
            </div>;
}