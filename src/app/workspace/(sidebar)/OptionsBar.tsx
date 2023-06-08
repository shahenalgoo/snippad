'use client';

// React
import { Dispatch, FC, SetStateAction, useState } from "react";
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
    const [searchActive, setSearchActive] = useState<boolean>(false);


    // Hooks
    //
    const pathname = usePathname();
    const router = useRouter();


    return (
        <div className={`relative flex items-center gap-2 h-14 px-3 border-b border-t border-border-light ${!notebookDropdown ? 'z-40' : 'z-30'}`}>

            {!searchActive &&
                <Filters noteFilter={noteFilter} setNoteFilter={setNoteFilter} />
            }

            <Search
                searchActive={searchActive}
                setSearchActive={setSearchActive}
            />

            {!searchActive &&
                <>
                    <Sort />

                    {/* Create new button - goes to workspace */}
                    <Button onClick={() => router.push('/workspace')} size='square' variant='black' disabled={pathname === '/workspace'} className="disabled:bg-slate-400">
                        <TbPlus size={20} strokeWidth={1.5} />
                    </Button>
                </>
            }
        </div>
    );
}

export default OptionsBar;