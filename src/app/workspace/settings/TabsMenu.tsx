'use client';

// React
import { FC } from "react";
import { usePathname } from "next/navigation"

// Components
import { Box, Button } from "@/components";


interface TabsMenuProps {

}

const TabsMenu: FC<TabsMenuProps> = () => {

    // Pathname
    const path = usePathname();


    const menuItems = [
        { title: "Account", url: "settings" },
        { title: "Notebooks", url: "settings/notebooks" },
    ]

    return (
        <Box className="shrink-0 flex gap-2 sm:flex-col sm:w-56 mb-6 sm:mb-0">
            {menuItems.map((item, i) => (
                <Button
                    key={i}
                    href={`/workspace/${item.url}`}
                    variant={path === `/workspace/${item.url}` ? 'black' : 'link'}
                    className="justify-start sm:w-full sm:h-12"
                >
                    {item.title}
                </Button>
            ))}
        </Box>
    );
}

export default TabsMenu;