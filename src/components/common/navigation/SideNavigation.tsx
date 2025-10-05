'use client';

import React from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import styles from './SideNavigation.module.scss';

const SideNavigation = () => {
    return (
        <div className={styles.container}>
            <div className={styles.searchBox}>
                <div className={styles.searchIcon}>
                    <Search />
                </div>
                <input type="text" placeholder="Search" className={styles.searchInput} />
            </div>
            <div className={styles.container__buttonBox}>
                <Button variant="outline" size="icon" className="w-full text-orange-500">
                    Add New Page
                </Button>
            </div>
            <div className={styles.container__todos}>
                <span className={styles.container__todos__title}>Your To do</span>
            </div>
        </div>
    )
}

export default SideNavigation