"use client"
import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
 
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import styles from "./LabelCalendar.module.css"

interface LabelCalendarProps {
    label: string;
    readOnly?: boolean;
}


export default function LabelCalendar({label, readOnly}: LabelCalendarProps) {

    const [date, setDate] = React.useState<Date>()


    return <div className={styles.container}>
                <span className={styles.container__label}>{label}</span>

                <Popover>
                <PopoverTrigger asChild>
                    <Button
                    variant="outline"
                    data-empty={!date}
                    className={cn("data-[empty=true]:text-muted-foreground w-[200px] justify-start text-left font-normal", readOnly && "cursor-not-allowed")}
                    disabled={readOnly}
                    >
                    <CalendarIcon />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={date} onSelect={setDate} />
                </PopoverContent>
                </Popover>
                   
            </div>
}