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

interface HeaderMobileProps {

}

const HeaderMobile: FC<HeaderMobileProps> = () => {

    // States
    //
    const [sidebar, setSidebar] = useGlobalState("sidebar");

    return (
        <nav className="lg:hidden fixed top-0 left-0 z-40 w-full h-20 px-4 flex items-center bg-white">
            <Button onClick={() => setSidebar(!sidebar)} variant='hamburger'>
                <TbMenu size={20} strokeWidth={1} />
            </Button>
        </nav>
    );
}

export default HeaderMobile;