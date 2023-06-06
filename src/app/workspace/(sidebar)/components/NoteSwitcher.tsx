'use client';

import { FC } from "react";
import { usePathname } from 'next/navigation';
import { Note } from "@/types/typings";

// import { TbNotes, TbCode } from "react-icons/tb";
import * as Icons from "react-icons/tb";
import Link from "next/link";
import { NoteFilter, NoteStatus, NoteType } from "@/types/enums";

interface NoteSwitcherProps {
    noteList: Note[] | null;

    noteFilter: NoteFilter;
}

const NoteSwitcher: FC<NoteSwitcherProps> = ({ noteList, noteFilter }) => {

    // Current path
    //
    const pathname = usePathname();


    // Remove HTML tags from string
    const removeTags = (text: string | undefined) => {
        if (text == null || undefined || '') return '';

        const newText = new DOMParser().parseFromString(text, 'text/html');
        return newText.body.textContent?.substring(0, 120) || "";
    }


    // Filter notes by different statuses
    //
    function noteFilterCondition(note: Note) {
        //switch depending on status
        switch (noteFilter) {
            case NoteFilter.all:
                return note.status === NoteStatus.published;
                break;
            case NoteFilter.starred:
                return note.status === NoteStatus.published && note.starred;
                break;
            case NoteFilter.archived:
                return note.status === NoteStatus.archived;
                break;
            case NoteFilter.trash:
                return note.status === NoteStatus.trashed;
                break;
            default:
                break;
        }
    }

    let color = "";
    // Assign the correct icon for the file type
    function setLanguageIcon(note: Note) {
        switch (note.snippet_language) {
            case 'html':
                color = "text-html";
                return "TbBrandHtml5";
                break;
            case 'css':
                color = "text-css";
                return "TbBrandCss3";
                break;
            case 'js':
                color = "text-js";
                return "TbBrandJavascript";
                break;
            case 'ts':
                color = "text-ts";
                return "TbBrandTypescript"
                break;
            default:
                break;
        }
    }


    //@ts-ignore
    const DynamicIcon = ({ name, className, size, strokeWidth }) => {
        //@ts-ignore
        const IconComponent = Icons[name];
        return <IconComponent className={className} size={size} strokeWidth={strokeWidth} />
    }


    return (
        <>
            {noteList?.filter((el: Note) => noteFilterCondition(el)).map((note: Note | null) => (

                <Link key={note?.$id} href={`/workspace/${note?.$id}`} title={note?.title} className={`flex items-center w-full rounded-lg my-1 py-4 px-4 border  ${pathname === `/workspace/${note?.$id}` ? 'bg-slate-50 border-primary' : 'border-transparent'}`}>

                    <div className="shrink-0 w-10 h-10 flex items-center">
                        {/* Default note icon */}
                        {note?.type === "note" && <DynamicIcon name="TbNotes" size={24} strokeWidth={1} className={`text-slate-600`} />}
                        {/* Code snippet icons */}
                        {note?.type === "code" && <DynamicIcon name={setLanguageIcon(note)} size={24} strokeWidth={1} className={color} />}
                    </div>

                    <div className="flex-1">
                        <h5 className={`text-md font-semibold ${pathname === `/workspace/${note?.$id}` ? 'text-slate-600' : 'text-slate-500'} `}>
                            <span className="line-clamp-1">{note?.title || 'Untitled'}</span>

                        </h5>
                        {note?.subtitle && <h6 className="text-xs text-slate-500 line-clamp-2">{note?.subtitle || 'No subtitle or note written yet'}</h6>}
                        {!note?.subtitle && <p className="text-xs text-slate-500 line-clamp-2">{removeTags(note?.body || 'No subtitle or note written yet')}</p>}
                    </div>

                    {note?.starred && <DynamicIcon name="TbStarFilled" size={16} strokeWidth={1} className="shrink-0 ml-4 mb-4 text-star" />}

                </Link>

            ))}
        </>
    );
}

export default NoteSwitcher;