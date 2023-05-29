'use client';

import { FC } from "react";

import { Button } from "@/components";

import { HiOutlineChevronUpDown } from "react-icons/hi2";



interface SidebarHeaderProps {

}

const SidebarHeader: FC<SidebarHeaderProps> = () => {
    return (
        <div className="h-[80px] flex justify-center items-center py-3 px-3 border-b border-border-default">
            <NotebookSwitcher />
        </div>
    );
}

export default SidebarHeader;




/**
 * Notebook switcher
 * 
 */
interface SwitcherProps {

}

const NotebookSwitcher: FC<SwitcherProps> = () => {
    return (
        <>
            <button className="flex justify-between items-center bg-white rounded-lg w-full h-full px-5 border border-border-default">
                <span className="text-sm font-semibold text-slate-600">Personal Notebook</span>
                <HiOutlineChevronUpDown size={26} strokeWidth={1} className="text-slate-500 ml-auto" />
            </button>
        </>
    );
}