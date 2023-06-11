/**
 * Mobile header
 * 
 */

'use client';

// React
import { FC } from "react";

// Icons
import { TbMenu } from "react-icons/tb";

// Components
import { Button } from "@/components";

// Utils
import { useGlobalState } from "@/utils/global-states";
import UserDropdown from "./UserDropdown";


const Navbar: FC = () => {

    // States
    //
    const [sidebar, setSidebar] = useGlobalState("sidebar");

    return (
        <nav className="fixed top-0 left-0 z-40 w-full h-16 px-2 lg:px-3 flex items-center justify-between backdrop-blur-sm bg-white/80 lg:backdrop-blur-none lg:bg-transparent">
            <Button onClick={() => setSidebar(!sidebar)} size='square' variant='black'>
                <TbMenu size={20} strokeWidth={1.5} />
            </Button>

            <UserDropdown />
        </nav>
    );
}

export default Navbar;