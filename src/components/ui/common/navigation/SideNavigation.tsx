import styles from "./SideNavigation.module.scss";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function SideNavigation() {
    return (
        <div className={styles.container}>
            <div className={styles.container__searchBox}>
                <Input type="text" placeholder="Search" className="focus-visible:ring-0 w-full"/>
                <Button variant="outline" size="icon">
                    <Search className="w-4 h-4" />
                </Button>
            </div>    
            <div className={styles.container__buttonBox}>
                <Button variant="outline" className="w-full text-orange-500 border-orange-400 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-600">
                    Add New Page
                </Button>
            </div>
            <div className={styles.container__todos}>
                <span className={styles.container__todos__label}>My Todos</span>

            </div>
        </div>
    );
}