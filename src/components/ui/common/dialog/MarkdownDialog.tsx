"use client"

import styles from "./MarkdownDialog.module.scss";
import {
    Dialog,
    DialogContent,
    // DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
  } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import LabelCalendar from "@/components/ui/common/calendar/LabelCalendar"
import { Separator } from "@/components/ui/separator"
import { DialogClose } from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import MarkdownEditor from "@uiw/react-markdown-editor";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/utils/supabase";


export default function MarkdownDialog() {

    const [title, setTitle] = useState<string>('');
    const [content, setContent] = useState<string | undefined>('Hello World');



    const handleSave = async () => {

        if (!title || !content) {
            toast.error("Please enter a title and content!");
            return;
        }else{

            
            const { data, error, status } = await supabase
            .from('todos')
            .insert([
            { title: title, content: content },
            ])
            .select()
        

            if (error) {
                toast.error(error.message);
                return;
            }

            if (status === 201) {
                toast.success('Successfully saved!');
            }
        }
    };

    return  <Dialog>
                <DialogTrigger asChild>
                    <span className="font-normal text-gray-400 hover:text-gray-500 cursor-pointer">Markdown</span>
                </DialogTrigger>
                <DialogContent className="sm:max-w-4xl">
                    <DialogHeader>
                        <DialogTitle>
                            <div className={styles.dialog__titleBox}>
                                <Checkbox className="w-5 h-5"/>
                                <input type="text" 
                                        placeholder="Enter the Title"
                                        className={styles.dialog__titleBox__input} 
                                        value={title} onChange={(e) => setTitle(e.target.value)}/>
                            </div>
                        </DialogTitle>
                        <div className={styles.dialog__calendarBox}>
                            <LabelCalendar label="from"/>
                            <LabelCalendar label="to"/>
                        </div>
                        <Separator/>
                        <div className={styles.dialog__markdown}>
                            <MarkdownEditor
                                value={content}
                                height="500px"
                                visible={true}
                                onChange={(e) => setContent(e)}
                            />
                        </div>
                    </DialogHeader>
                    <DialogFooter>
                        <div className={styles.dialog__buttonBox}>
                            <DialogClose asChild>
                                <Button variant="ghost" className="font-normal text-gray-400 hover:text-gray-500">Cancel</Button>
                            </DialogClose>
                            <DialogClose asChild>
                            <Button type="submit" onClick={handleSave} className="bg-blue-500 text-white hover:bg-blue-600">Save</Button>
                            </DialogClose>                                
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
}