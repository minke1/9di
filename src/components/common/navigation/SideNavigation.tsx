'use client';

import React, { useEffect, useState } from 'react';
import { Dot, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import styles from './SideNavigation.module.scss';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase';
import { toast } from 'sonner';
import { Todo } from '@/types/todos';

const SideNavigation = () => {

    const router = useRouter();
    const [todos, setTodos] = useState<Todo[]>([]);

    const onCreate = async () => {

        //supabase 연동
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

    // 기존 데이터
    const getTodos = async () => {
        const {data:todos, error} = await supabase.from('todos').select('*');
        if (error) {
            toast.error(error.message);
            return;
        }
        console.log(todos);
        setTodos(todos);
    }

    useEffect(() => {
        getTodos();
    }, [todos]);

    return (
        <div className={styles.container}>
            <div className={styles.searchBox}>
                <div className={styles.searchIcon}>
                    <Search />
                </div>
                <input type="text" placeholder="Search" className={styles.searchInput} />
            </div>
            <div className={styles.container__buttonBox}>
                <Button variant="outline" size="icon" className="w-full text-orange-500" onClick={onCreate}>
                    Add New Page
                </Button>
            </div>
            <div className={styles.container__todos}>
                <span className={styles.container__todos__title}>Your To do</span>
                {todos && todos.map((todo:Todo) => {
                    return (
                        <div key={todo.id} className="flex items-center gap-2 bg-[#F9FAFB] p-2 rounded-md cursor-pointer" onClick={() => router.push(`/create/${todo.id}`)}>
                            <Dot className="mr-1 text-green-400"></Dot>
                            <span>{todo.title}</span>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default SideNavigation