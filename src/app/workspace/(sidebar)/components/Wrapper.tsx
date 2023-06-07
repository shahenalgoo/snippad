'use client';

// React
import { FC, useCallback, useEffect } from "react";

// Utils
import { useGlobalState } from "@/utils/global-states";


interface SidebarWrapperProps {
    children: React.ReactNode;
}


const SidebarWrapper: FC<SidebarWrapperProps> = ({ children }) => {

    // States
    //
    const [sidebar, setSidebar] = useGlobalState("sidebar");


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
            <div className={`fixed top-0 z-50 w-80 xl:w-96 h-full transition-all ${!sidebar ? 'invisible lg:visible -left-80 lg:left-0' : 'visible left-0'} bg-white lg:border-r border-border-light`}>
                {children}
            </div>

            {/* Mobile blurred backdrop */}
            <button onClick={() => setSidebar(!sidebar)} className={`lg:!hidden fixed top-0 left-0 z-40 w-full h-full transition-all backdrop-blur-sm ${!sidebar ? 'invisible bg-black/0' : 'visible bg-black/60'}`}>
                &nbsp;
            </button>
        </aside >
    );
}

export default SidebarWrapper;