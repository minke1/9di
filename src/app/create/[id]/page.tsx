"use client";

import { Button } from "@/components/ui/button";
import styles from "./page.module.scss"
import LabelCalendar from "@/components/ui/common/calendar/LabelCalendar";
import { Progress } from "@/components/ui/progress"
import BasicBoard from "@/components/ui/common/board/basicBoard";
import {Todo, BoardContent} from "@/types/todos";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/utils/supabase";

export default function Create() {

    const router = useRouter();
    const pathname = usePathname();
    
    const [boards, setBoards] = useState<Todo>();
    const [startDate, setStartDate] = useState<string | Date>();
    const [endDate, setEndDate] = useState<string | Date>();

    const createBoard = async() => {

        let newContents: BoardContent[] = [];
        
        const BoardContent = {
            boardId: "",
            isConmpleted: false,
            title: "",
            startDate: "",
            endDate: "",
            content: ""
        }

        if(boards && boards.content?.length && boards.content.length > 0) {
            newContents = [...boards.content, BoardContent];
           
        }else if (boards && boards.content?.length === 0) {
            newContents.push(BoardContent);
        }
    }

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
                    {/* <div className={styles.container__body__infoBox}>
                        <span className={styles.title}>There is no page</span>
                        <span className={styles.subTitle}>Click "Add New Page" to create a new page</span>
                        <button className={styles.button}>Click</button>
                    </div> */}
                    <BasicBoard/>
                </main>
            </div>;
}