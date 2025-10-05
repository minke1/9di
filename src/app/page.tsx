'use client'

import React from 'react'
import styles from './page.module.scss'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()
  return (
    <div className={styles.container}>
      <div className={styles.container__onBoarding}>
        <span className={styles.container__onBoarding__title}>How to Start:</span>        
        <div className={styles.container__onBoarding__steps}>
          <span>1. Create a board</span>
          <span>2. Add boards to page</span>
        </div>
        <Button variant="outline" className='w-full bg-transparent text-orange-500 border-orange-400 hover:bg-orange-50' onClick={() => router.push('/create')}>
          Add New
        </Button>
      </div>
    </div>
  )
}
