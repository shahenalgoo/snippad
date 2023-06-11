'use client';

// React
import { FC } from "react";

// Typings
import { Note } from "@/types/typings";
import { NoteFilter } from "@/types/enums";

// Utils
import { setGlobalState, useGlobalState } from "@/utils/global-states";
import NoteCard from "../cards/NoteCard";


interface NoteSwitcherProps {
    noteList: Note[] | null;
    noteFilter: NoteFilter;
}


const NoteSwitcher: FC<NoteSwitcherProps> = ({ noteList, noteFilter }) => {

    //States
    //
    const [notebookDropdown] = useGlobalState("notebookSwitcher");
    const [sidebarActive] = useGlobalState("sidebar");


    return (
        <div className={`sidebar-notes-overflow relative h-[calc(100%_-_120px)] overflow-scroll py-4 px-3 transition-opacity ${!notebookDropdown ? '' : 'z-30 opacity-10'}`}>
            {noteList?.map((note: Note | null) => (
                <div key={note?.$id} className="my-y" onClick={() => setGlobalState("sidebar", !sidebarActive)}>
                    <NoteCard note={note} asSearchResult={false} />
                </div>
            ))}
        </div>
    );
}

export default NoteSwitcher;