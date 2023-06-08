'use client';

// React
import { Dispatch, FC, MouseEventHandler, SetStateAction } from "react";

// Components
import { Button } from "@/components";

// Icons
import { TbChevronDown } from "react-icons/tb"
import * as Icons from "react-icons/tb"
import { NoteFilter } from "@/types/enums";

interface FiltersProps {
    noteFilter: NoteFilter;
    setNoteFilter: Dispatch<SetStateAction<NoteFilter>>
}

const Filters: FC<FiltersProps> = ({ noteFilter, setNoteFilter }) => {

    return (
        <div className="dropdown group flex-1 relative">
            <Button variant='border' className="w-full justify-between group-hover:bg-neutral-100">
                <span className="capitalize">{noteFilter}</span>
                <TbChevronDown />
            </Button>

            <div className={`dropdown-menu overflow-hidden absolute invisible opacity-0 top-[101%] w-full p-1 rounded-lg transition-all bg-white border border-neutral-300 shadow-md`}>
                <FilterButton onClick={() => setNoteFilter(NoteFilter.all)} icon="TbLayoutList" title="All" />
                <FilterButton onClick={() => setNoteFilter(NoteFilter.starred)} icon="TbStar" title="Starred" />
                <FilterButton onClick={() => setNoteFilter(NoteFilter.archived)} icon="TbArchive" title="Archived" />
                <FilterButton onClick={() => setNoteFilter(NoteFilter.trash)} icon="TbTrash" title="Trashed" />
            </div>
        </div>
    );
}

export default Filters;



interface FilterButtonProps {
    onClick: MouseEventHandler<HTMLButtonElement>;
    icon: string;
    title: string;
}

const FilterButton: FC<FilterButtonProps> = ({ onClick, icon, title }) => {

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
        </button>
    );
}
