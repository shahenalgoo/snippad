/**
 * Switch between different notebooks
 * Location used: Dropdown menu in the header of the sidebar
 * 
 */

'use client';

// React
import { FC } from "react";
import { useGlobalState, setGlobalState } from "@/utils/global-states";

// Icons
import { HiOutlineChevronUpDown } from "react-icons/hi2";
import { TbCircle, TbCircleCheckFilled } from "react-icons/tb";

// Hooks
import { useNotebook } from "@/context/NotebookContext";
import { Notebook } from "@/types/typings";



interface NotebookSwitcherProps {
    className: string;
}

const NotebookSwitcher: FC<NotebookSwitcherProps> = ({ className }) => {

    // States
    //
    const [notebookDropdown, setNotebookDropdown] = useGlobalState("notebookSwitcher");


    return (
        <div className={`relative h-20 flex justify-center items-center py-3 px-3 ${className}`}>
            <button onClick={() => setNotebookDropdown(!notebookDropdown)} className={`flex justify-between items-center rounded-lg w-full h-full px-5 bg-white border ${!notebookDropdown ? 'border-border-light' : 'border-primary'}`}>
                <span className="text-sm font-semibold text-slate-600">General Notebook</span>
                <HiOutlineChevronUpDown size={26} strokeWidth={1} className="text-slate-500 ml-auto" />
            </button>

            <NotebookDropdown className={` transition-all ${!notebookDropdown ? 'invisible opacity-0' : 'visible opacity-100'}`} />
        </div>
    );
}

export default NotebookSwitcher;



interface NotebookDropdownProps {
    className: string;
}

const NotebookDropdown: FC<NotebookDropdownProps> = ({ className }) => {

    // States
    //
    const [notebookDropdown, setNotebookDropdown] = useGlobalState("notebookSwitcher");


    // Hooks
    //
    const { collection: notebookList, total, defaultNotebook, activeNotebook, activateNotebook, createNotebook, deleteNotebook } = useNotebook();


    const handleSwitchNotebook = (notebook: Notebook) => {
        activateNotebook(notebook);
        setNotebookDropdown(!notebookDropdown)
    }

    return (
        <div className={`absolute  left-0 z-50 w-full h-auto p-3 transition-all ${!notebookDropdown ? 'top-8' : 'top-16'} ${className}`}>
            <div className="overflow-hidden w-full bg-white rounded-lg">

                {notebookList?.map((notebook: Notebook) => (
                    <button key={notebook.$id} onClick={() => handleSwitchNotebook(notebook)} className="flex items-center w-full p-4 transition-all border-b border-border-light last:border-none hover:bg-slate-100">
                        {activeNotebook?.$id === notebook.$id ?
                            <TbCircleCheckFilled size={20} strokeWidth={1} className="mr-3 text-primary" />
                            :
                            <TbCircle size={20} strokeWidth={1} className="mr-3 text-slate-300" />
                        }
                        <span className="text-sm font-semibold">{notebook.title}</span>
                    </button>
                ))}

            </div>
        </div>
    )
}