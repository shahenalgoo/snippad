'use client';

import { FC } from "react";
import { TbMenu } from "react-icons/tb";
import { useGlobalState } from "@/utils/global-states";

import { Button } from "@/components";

interface WorkspaceHeaderProps {

}

const WorkspaceHeader: FC<WorkspaceHeaderProps> = () => {

    const [sidebar, setSidebar] = useGlobalState("sidebar");


    return (
        <nav className="lg:hidden fixed top-0 left-0 z-40 w-full h-20 px-4 flex items-center bg-white">
            <Button onClick={() => setSidebar(!sidebar)} variant='hamburger'>
                <TbMenu size={20} strokeWidth={1} />
            </Button>
        </nav>
    );
}

export default WorkspaceHeader;