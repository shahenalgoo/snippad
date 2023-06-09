'use client';

// React
import { FC, useCallback, useEffect } from "react";
import { usePathname } from "next/navigation";

// Utils
import { useGlobalState } from "@/utils/global-states";


interface SidebarWrapperProps {
    children: React.ReactNode;
}


const SidebarWrapper: FC<SidebarWrapperProps> = ({ children }) => {

    // States
    //
    const [sidebar, setSidebar] = useGlobalState("sidebar");


    // Hooks
    //
    const pathname = usePathname();


    // Set sidebar to false on breakpoint
    //
    const handleResize = useCallback(() => {
        if (window.innerWidth > 1023) {
            setSidebar(false)
        }
    }, [setSidebar]);


    // Use effect
    //
    useEffect(() => {
        window.addEventListener("resize", handleResize);
    }, [handleResize]);

    return (
        <aside>
            {/* Sidebar Content */}
            <div className={`fixed top-0 z-50 w-80 xl:w-96 h-full transform-gpu transition-all duration-300 ${!sidebar ? 'invisible opacity-0 -left-40' : 'visible opacity-100 left-0'} lg:visible lg:left-0 lg:opacity-100 bg-white lg:border-r border-border-light`}>
                {children}
            </div>

            {/* Mobile blurred backdrop */}
            <button onClick={() => setSidebar(!sidebar)} className={`lg:!hidden fixed top-0 left-0 z-40 w-full h-full cursor-zoom-out transition-all duration-400 backdrop-blur-lg bg-black/20 outline-none shadow-none ${!sidebar ? 'invisible opacity-0' : 'visible opacity-100'}`}>
                &nbsp;
            </button>
        </aside >
    )
}

export default SidebarWrapper;