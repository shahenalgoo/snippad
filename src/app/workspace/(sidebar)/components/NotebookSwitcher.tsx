/**
 * Switch between different notebooks
 * Location used: Dropdown menu in the header of the sidebar
 * 
 */

'use client';

import { FC } from "react";
import useToggle from "@/hooks/useToggle";

import { HiOutlineChevronUpDown } from "react-icons/hi2";


interface NotebookSwitcherProps {

}

const NotebookSwitcher: FC<NotebookSwitcherProps> = () => {

    const [dropdown, setDropdown] = useToggle();

    return (
        <div className="relative h-20 flex justify-center items-center py-3 px-3">
            <button onClick={setDropdown} className="flex justify-between items-center rounded-lg w-full h-full px-5 border border-border-color bg-white">
                <span className="text-sm font-semibold text-slate-600">Personal Notebook</span>
                <HiOutlineChevronUpDown size={26} strokeWidth={1} className="text-slate-500 ml-auto" />
            </button>

            <NotebookDropdown className={!dropdown ? 'hidden' : 'block'} />
        </div>
    );
}

export default NotebookSwitcher;


const NotebookDropdown = ({ className }: any) => {
    return (
        <div className={`absolute top-14 left-0 z-50 w-full h-auto p-4 ${className}`}>
            <div className="w-full bg-slate-50 rounded-lg border border-slate-300 p-4">
                test
            </div>
        </div>
    )
}