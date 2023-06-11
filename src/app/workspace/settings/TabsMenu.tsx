'use client';

// React
import { FC } from "react";
import { usePathname } from "next/navigation"

// Components
import { Box, Button } from "@/components";


const TabsMenu: FC = () => {

    // Pathname
    const path = usePathname();


    const menuItems = [
        { title: "Notebooks", url: "settings/notebooks" },
        { title: "Account", url: "settings" },
    ]

    return (
        <Box space='sm' className="shrink-0 flex gap-2 sm:flex-col sm:w-56 h-fit mb-6 sm:mb-0">
            {menuItems.map((item, i) => (
                <Button
                    key={i}
                    href={`/workspace/${item.url}`}
                    className={`justify-start sm:w-full sm:h-12 bg-transparent dark:text-white ${path === `/workspace/${item.url}` ? 'bg-neutral-300 dark:bg-neutral-700' : ''}`}
                >
                    {item.title}
                </Button>
            ))}
        </Box>
    );
}

export default TabsMenu;