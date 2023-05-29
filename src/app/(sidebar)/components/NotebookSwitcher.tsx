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

    const [dropdownActive, setDropdownActive] = useToggle();

    return (
        <div className="h-20 flex justify-center items-center py-3 px-3">
            <button onClick={setDropdownActive} className="flex justify-between items-center rounded-lg w-full h-full px-5 border border-border-color bg-white">
                <span className="text-sm font-semibold text-slate-600">Personal Notebook</span>
                <HiOutlineChevronUpDown size={26} strokeWidth={1} className="text-slate-500 ml-auto" />
            </button>
        </div>
    );
}

export default NotebookSwitcher;