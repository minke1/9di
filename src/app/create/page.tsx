import Image from "next/image";
import { Button } from "@/components/ui/button";
import styles from "./page.module.scss"
import LabelCalendar from "@/components/ui/common/calendar/LabelCalendar";
import { Progress } from "@/components/ui/progress"
import BasicBoard from "@/components/ui/common/board/basicBoard";

export default function Create() {
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
                                            hover:border-orange-50">Add New Page</Button>
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