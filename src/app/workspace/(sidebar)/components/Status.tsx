'use client';

// React
import { FC } from "react";

// Components
import { Button } from "@/components";

// Icons
import { TbChevronDown, TbLayoutList } from "react-icons/tb"
import * as Icons from "react-icons/tb"

interface StatusProps {
    noteStatus: any;
    setNoteStatus: any
}

const Status: FC<StatusProps> = ({ noteStatus, setNoteStatus }) => {

    return (
        <>
            <div className="dropdown group flex-1 relative">
                <Button variant='gray' className="w-full justify-between transition-all bg-slate-100 group-hover:bg-slate-200">
                    <span className="capitalize">{noteStatus}</span>
                    <TbChevronDown />
                </Button>

                <div className={`dropdown-menu overflow-hidden absolute invisible opacity-0 top-[101%] w-full p-1 rounded-lg transition-all bg-slate-200`}>

                    <StatusButton onClick={() => setNoteStatus("all")} icon="TbLayoutList" title="All" />
                    <StatusButton onClick={() => setNoteStatus("starred")} icon="TbStar" title="Starred" />
                    <StatusButton onClick={() => setNoteStatus("archived")} icon="TbArchive" title="Archived" />
                    <StatusButton onClick={() => setNoteStatus("trashed")} icon="TbTrash" title="Trashed" />

                </div>
            </div>
        </>
    );
}

export default Status;



interface StatusButtonProps {
    onClick: any;
    icon: string;
    title: string;
}

const StatusButton: FC<StatusButtonProps> = ({ onClick, icon, title }) => {

    //@ts-ignore
    const DynamicIcon = ({ icon, className, size, strokeWidth }) => {
        //@ts-ignore
        const IconComponent = Icons[icon];
        return <IconComponent className={className} size={size} strokeWidth={strokeWidth} />
    }

    return (
        <button onClick={onClick} className="flex items-center w-full py-2 px-3 rounded-md transition-all bg-transparent hover:bg-slate-50">
            <DynamicIcon icon={icon} className="mr-3" size={14} strokeWidth={1} />
            <span className="text-sm font-semibold">{title}</span>
        </button>
    );
}
