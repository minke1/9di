"use client";

import styles from "./SideNavigation.module.scss";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dot, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase";
import { toast } from "sonner";
import { useEffect } from "react";
import { useState } from "react";
// import { todo } from "@uiw/react-markdown-editor";
import { Todo } from "@/types/todos";


export default function SideNavigation() {

    const router = useRouter();
    const [todos, setTodos] = useState<Todo[]>([]);

    const onCreate = async () => {

        const {error, status} = await supabase.from('todos').insert([
            {
                title: '',
                start_date: '',
                end_date: '',
                content: ''
            },
          ])

        if (error) {
            toast.error(error.message);
            return;
        }

        if (status === 201) {
            toast.success('Successfully saved!');
            router.push('/create');
        } 
    }

    const getTodos = async() => {

        const {data:todos, error} = await supabase.from('todos').select('*');

        if (error) {
            toast.error(error.message);
            return;
        }

        setTodos(todos);
    }

    useEffect(() => {
        getTodos();
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.container__searchBox}>
                <Input type="text" placeholder="Search" className="focus-visible:ring-0 w-full"/>
                <Button variant="outline" size="icon">
                    <Search className="w-4 h-4" />
                </Button>
            </div>    
            <div className={styles.container__buttonBox}>
                <Button variant="outline" className="w-full text-orange-500 border-orange-400 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-600" onClick={onCreate}>
                    Add New Page
                </Button>
            </div>
            <div className={styles.container__todos}>
                <span className={styles.container__todos__label}>My Todos</span>
                <div className={styles.container__todos__list}>
                {todos && todos.map((todo:Todo) => {
                    return (
                        <div className="flex items-center gap-2 bg-[#F9FAFB] p-2 rounded-md cursor-pointer" key={todo.id}>
                            <Dot className="mr-1 text-green-400"></Dot>
                            <span>{todo.title}</span>
                        </div>
                    )
                })}
                </div>
            </div>
        </div>
    );
}