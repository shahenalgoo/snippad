/**
 * Switch between different notebooks
 * Location used: Dropdown menu in the header of the sidebar
 * 
 */

'use client';

// React
import { FC } from "react";
import { useGlobalState } from "@/utils/global-states";

// Icons
import { HiOutlineChevronUpDown } from "react-icons/hi2";
import { TbNotebook, TbCircle, TbCircleCheckFilled } from "react-icons/tb";

// Hooks
import { useNotebook } from "@/context/NotebookContext";
import { Notebook } from "@/types/typings";

// Components
import { Button } from "@/components";


interface NotebooksProps {

}


const Notebooks: FC<NotebooksProps> = () => {

    // States
    //
    const [notebookDropdown, setNotebookDropdown] = useGlobalState("notebookSwitcher");


    // Hooks
    //
    const { collection: notebookList, activeNotebook, activateNotebook } = useNotebook();


    // When switching notebook:
    // 
    const handleSwitchNotebook = (notebook: Notebook) => {
        activateNotebook(notebook);
        setNotebookDropdown(!notebookDropdown)
    }

    return (
        <>
            <div className={`relative h-20 flex justify-center items-center py-3 px-3 ${!notebookDropdown ? '' : 'z-50'}`}>

                {/* Button with active notebook title */}
                <button onClick={() => setNotebookDropdown(!notebookDropdown)} className={`flex justify-between items-center rounded-lg w-full h-full px-4 text-neutral-600 border ${!notebookDropdown ? ' border-transparent' : 'bg-white border-black'}`}>
                    <TbNotebook size={24} strokeWidth={1} className="mr-2 " />
                    <span className="font-semibold">{activeNotebook?.title}</span>
                    <HiOutlineChevronUpDown size={26} strokeWidth={1} className="ml-auto opacity-30" />
                </button>


                {/* Dropdown menu */}
                <div className={`absolute left-0 z-50 w-full h-auto p-3 transition-all ${!notebookDropdown ? 'invisible opacity-0 top-8' : 'visible opacity-100 top-16'} `}>

                    {/* Create new notebook */}
                    <div className="relative mb-2 flex gap-2" onClick={() => setNotebookDropdown(false)}>
                        <Button href="/workspace/settings/notebooks" variant='black' className="flex-1">
                            Manage Notebooks
                        </Button>
                    </div>

                    {/* List all notebooks */}
                    <div className="overflow-hidden w-full bg-white rounded-lg">
                        {notebookList?.map((notebook: Notebook) => (
                            <button key={notebook.$id} onClick={() => handleSwitchNotebook(notebook)} className="flex items-center w-full p-4 transition-all border-b border-border-light last:border-none hover:bg-neutral-100">
                                {activeNotebook?.$id === notebook.$id ?
                                    <TbCircleCheckFilled size={24} strokeWidth={1} className="mr-3 text-primary" />
                                    :
                                    <TbCircle size={24} strokeWidth={1} className="mr-3 text-neutral-300" />
                                }
                                <span className="font-semibold">{notebook.title}</span>
                            </button>
                        ))}
                    </div>
                </div>

            </div>

            {/* Notebook backdrop */}
            <div onClick={() => setNotebookDropdown(!notebookDropdown)} className={`absolute top-0 left-0 w-full h-full cursor-zoom-out backdrop-blur-lg bg-black/10 transition-all ${!notebookDropdown ? 'invisible opacity-0' : 'visible opacity-100 z-40'}`}>
                &nbsp;
            </div>
        </>
    );
}

export default Notebooks;