import styles from "./basicBoard.module.scss";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ChevronUp } from "lucide-react";
import LabelCalendar from "@/components/ui/common/calendar/LabelCalendar";
import MarkdownDialog from "@/components/ui/common/dialog/MarkdownDialog";

export default function BasicBoard() {
    return <div className={styles.container}>
        <div className={styles.container__header}>
            <div className={styles.container__header__titleBox}>
                <Checkbox className="w-5 h-5"/>
                <span className={styles.title}>title write</span>
            </div>
            
            <Button variant="ghost"><ChevronUp className="w-5 h-5 text-gray-400"/></Button>
            
        </div>
        <div className={styles.container__body}>
            <div className={styles.container__body__calendarBox}>
                <LabelCalendar label="from"/>
                <LabelCalendar label="to"/>
            </div>
            <div className={styles.container__body__buttonBox}>
                <Button variant="outline" className="font-normal text-gray-400 hover:bg-green-50 hover:text-green-600">Duplicate</Button>
                <Button variant="outline" className="font-normal text-gray-400 hover:bg-red-50 hover:text-red-600">Delete</Button>
            </div>

            <div className={styles.container__body__footer}>
                <MarkdownDialog/>
            </div>
        </div>
        </div>
}