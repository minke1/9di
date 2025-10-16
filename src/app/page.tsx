"use client"

import styles from "./page.module.scss"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { supabase } from "@/utils/supabase";
import { toast } from "sonner";

export default function Home() {

  const router = useRouter();

  // 페이지 생성 및 supabase 연동

  const onCreate = async() => {
    const {data, error, status} = await supabase.from("todos").insert([
      { 
          title: '',
          start_date: new Date(),
          end_date: new Date(),
          content:[]
      },
    ]).select();

    if (error) {
      console.error(error);
      return;
    }

    if (status === 201) {
      toast.success('Successfully saved!');

      const { data } = await supabase.from("todos").select("*");

      if (data) {
        router.push(`/create/${data[data.length - 1].id}`);
      }

    }

    
  }

  return <div className={styles.container}>
              <div className={styles.container_onBoarding}>
                <span className={styles.container_onBoarding_title}>Shadcn Board</span>
                <div className={styles.container_onBoarding_steps}>
                  <span>1. create a page</span>
                  <span>2. Add boards to page</span>
                </div>
                <Button variant="outline" 
                        className="w-full bg-transparent
                                     text-orange-500 hover:bg-orange-50 border-orange-500
                                     hover:border-orange-50" onClick={onCreate}>Add New Page</Button>
              </div>
         </div>;
}