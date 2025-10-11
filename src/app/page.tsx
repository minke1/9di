"use client"

import styles from "./page.module.scss"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function Home() {

  const router = useRouter();

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
                                     hover:border-orange-50" onClick={() => {router.push("/create")}}>Add New Page12</Button>
              </div>
         </div>;
}