/**
 * Sidedar display - A dropdown for 4 filter types: all, starred, archived, trash
 * Allows user to switch between filters
 * Calculate total for each filter
 * 
 */

'use client';

// React
import { Dispatch, FC, MouseEventHandler, SetStateAction, useEffect, useState } from "react";

//Typings
import { NoteFilter, NoteStatus } from "@/types/enums";

// Hooks
import { useNotebook } from "@/context/NotebookContext";

// Components
import { Button } from "@/components";

// Icons
import { TbChevronDown } from "react-icons/tb"
import * as Icons from "react-icons/tb"

interface FiltersProps {
    noteFilter: NoteFilter;
    setNoteFilter: Dispatch<SetStateAction<NoteFilter>>
}

const Filters: FC<FiltersProps> = ({ noteFilter, setNoteFilter }) => {

    //States
    //
    const [allTotal, setAllTotal] = useState<number>(0);
    const [starredTotal, setStarredTotal] = useState<number>(0);
    const [archivedTotal, setArchivedTotal] = useState<number>(0);
    const [trashTotal, setTrashTotal] = useState<number>(0);


    // Hooks
    const { activeNotebook, allNotes } = useNotebook();


    // Calculate each filter's total
    const calculateFiltersAmount = () => {
        let all = 0;
        let starred = 0;
        let archived = 0;
        let trash = 0;

        allNotes?.forEach(element => {
            switch (element.status) {
                case NoteStatus.published:
                    all++;
                    if (element.starred) starred++;
                    break;
                case NoteStatus.archived:
                    archived++;
                    break;
                case NoteStatus.trashed:
                    trash++;
                    break;
                default:
                    break;
            }
        });

        // Set states
        setAllTotal(all);
        setStarredTotal(starred);
        setArchivedTotal(archived);
        setTrashTotal(trash);
    };


    // Show correct total for the currently active filter
    const activeFilterTotal = () => {
        switch (noteFilter) {
            case NoteFilter.all:
                return allTotal;
                break;
            case NoteFilter.starred:
                return starredTotal;
                break;
            case NoteFilter.archived:
                return archivedTotal;
                break;
            case NoteFilter.trash:
                return trashTotal;
                break;
        }
    }


    // Use effect
    //
    useEffect(() => {
        calculateFiltersAmount();
    }, [allNotes, activeNotebook]);


    return (
        <div className="dropdown group flex-1 relative">
            <Button variant='border' className="w-full justify-between group-hover:bg-neutral-100">
                <span className="capitalize">
                    {noteFilter} ({activeFilterTotal()})</span>
                <TbChevronDown />
            </Button>

            <div className={`dropdown-menu overflow-hidden absolute invisible opacity-0 top-[110%] w-[215px] p-1 rounded-lg transition-all bg-white border border-neutral-300 shadow-md`}>
                <FilterButton onClick={() => setNoteFilter(NoteFilter.all)} icon="TbLayoutList" title="All" total={allTotal} />
                <FilterButton onClick={() => setNoteFilter(NoteFilter.starred)} icon="TbStar" title="Starred" total={starredTotal} />
                <FilterButton onClick={() => setNoteFilter(NoteFilter.archived)} icon="TbArchive" title="Archived" total={archivedTotal} />
                <FilterButton onClick={() => setNoteFilter(NoteFilter.trash)} icon="TbTrash" title="Trash" total={trashTotal} />
            </div>
        </div>
    );
}

export default Filters;



interface FilterButtonProps {
    onClick: MouseEventHandler<HTMLButtonElement>;
    icon: string;
    title: string;
    total: number;
}

const FilterButton: FC<FilterButtonProps> = ({ onClick, icon, title, total }) => {

    //@ts-ignore
    const DynamicIcon = ({ icon, className, size, strokeWidth }) => {
        //@ts-ignore
        const IconComponent = Icons[icon];
        return <IconComponent className={className} size={size} strokeWidth={strokeWidth} />
    }

    return (
        <button onClick={onClick} className="flex items-center w-full py-2 px-3 rounded-md transition-all bg-transparent hover:bg-neutral-100">
            <DynamicIcon icon={icon} className="mr-3" size={18} strokeWidth={1} />
            <span className="font-semibold">{title}</span>
            &nbsp;
            <span className="font-semibold text-neutral-400">({total})</span>
        </button>
    );
}
