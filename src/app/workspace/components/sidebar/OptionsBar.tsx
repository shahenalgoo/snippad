'use client';

// React
import { Dispatch, FC, SetStateAction, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

// Typings
import { NoteFilter } from "@/types/enums";

// Components
import { Button } from "@/components";

// Icons
import { TbPlus, TbSearch } from 'react-icons/tb';

// Options bar components
import Filters from "./components/Filters";
import Sort from "./components/Sort";

// Utils
import { useGlobalState, setGlobalState } from "@/utils/global-states";


interface OptionsBarProps {
    noteFilter: NoteFilter;
    setNoteFilter: Dispatch<SetStateAction<NoteFilter>>
    setSortDate: Dispatch<SetStateAction<string>>;
    setSortType: Dispatch<SetStateAction<string>>;
    setSortLanguage: Dispatch<SetStateAction<string>>;

}


const OptionsBar: FC<OptionsBarProps> = ({ noteFilter, setNoteFilter, setSortDate, setSortType, setSortLanguage }) => {

    //States
    //
    const [notebookDropdown] = useGlobalState("notebookSwitcher");
    const [searchModal] = useGlobalState("searchModal");
    const [sortActive, setSortActive] = useState<boolean>(false);


    // Hooks
    //
    const pathname = usePathname();
    const router = useRouter();


    return (
        <div className={`relative flex items-center gap-2 px-3 border-b border-t border-border-light ${!notebookDropdown ? 'z-40' : 'z-30'} ${!sortActive ? 'h-14' : 'h-auto'}`}>

            {!sortActive &&
                <Filters noteFilter={noteFilter} setNoteFilter={setNoteFilter} />
            }

            <Sort
                sortActive={sortActive}
                setSortActive={setSortActive}
                setSortDate={setSortDate}
                setSortType={setSortType}
                setSortLanguage={setSortLanguage}
            />

            {!sortActive &&
                <Button onClick={() => setGlobalState('searchModal', !searchModal)} variant='gray' size='square'>
                    <TbSearch size={20} strokeWidth={1} />
                </Button>
            }

            {!sortActive &&
                <Button onClick={() => router.push('/workspace')} size='square' variant='black' disabled={pathname === '/workspace'} className="disabled:bg-slate-400">
                    <TbPlus size={20} strokeWidth={1.5} />
                </Button>
            }
        </div>
    );
}

export default OptionsBar;