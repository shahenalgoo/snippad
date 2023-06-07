'use client';

// React
import { Dispatch, FC, SetStateAction } from "react";
import { usePathname, useRouter } from "next/navigation";

// Typings
import { NoteFilter } from "@/types/enums";

// Components
import { Button } from "@/components";

// Icons
import { TbPlus } from 'react-icons/tb';

// Options bar components
import Filters from "./components/Filters";
import Search from "./components/Search";
import Sort from "./components/Sort";

// Utils
import { useGlobalState } from "@/utils/global-states";


interface OptionsBarProps {
    noteFilter: NoteFilter;
    setNoteFilter: Dispatch<SetStateAction<NoteFilter>>
}


const OptionsBar: FC<OptionsBarProps> = ({ noteFilter, setNoteFilter }) => {

    //States
    //
    const [notebookDropdown] = useGlobalState("notebookSwitcher");

    // Hooks
    //
    const pathname = usePathname();
    const router = useRouter();


    return (
        <div className={`relative flex items-center gap-2 py-2 px-3 border-b border-t border-border-light ${!notebookDropdown ? 'z-40' : 'z-30'}`}>

            <Filters noteFilter={noteFilter} setNoteFilter={setNoteFilter} />
            <Search />
            <Sort />

            {/* Create new button - goes to workspace */}
            <Button onClick={() => router.push('/workspace')} disabled={pathname === '/workspace'} size='square' className="disabled:bg-slate-100">
                <TbPlus size={20} strokeWidth={1.5} />
            </Button>
        </div>
    );
}

export default OptionsBar;