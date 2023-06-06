'use client';

import { Dispatch, FC, SetStateAction } from "react";
import { usePathname } from 'next/navigation';
import { Note } from "@/types/typings";

// import { TbNotes, TbCode } from "react-icons/tb";
import * as Icons from "react-icons/tb";
import Link from "next/link";
import { NoteFilter, NoteStatus, NoteType } from "@/types/enums";

interface NoteSwitcherProps {
    noteList: Note[] | null;

    noteFilter: NoteFilter;

    //setNoteStatus: Dispatch<SetStateAction<NoteStatus>>;
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
            {noteList?.map((note: Note | null) => (
                <Link key={note?.$id} href={`/workspace/${note?.$id}`} title={note?.title} className={`flex items-center w-full rounded-lg mb-2 py-4 px-4 border  ${pathname === `/workspace/${note?.$id}` ? 'bg-slate-50 border-primary' : 'border-transparent'}`}>
                    <div className="shrink-0 w-10 h-10 flex items-center">
                        {/* {note?.type === "note" && <TbNotes size={24} strokeWidth={1} className={`${pathname === `/workspace/${note?.$id}` ? 'text-slate-600' : 'text-slate-300'}`} />} */}
                        {/* {note?.type === "code" && <TbCode size={24} strokeWidth={1} className={`${pathname === `/workspace/${note?.$id}` ? 'text-slate-600' : 'text-slate-300'}`} />} */}

                        {note?.type === "note" && <DynamicIcon name="TbNotes" size={24} strokeWidth={1} className={`${pathname === `/workspace/${note?.$id}` ? 'text-slate-600' : 'text-slate-300'}`} />}


                        {/* {note?.type === "code" && <DynamicIcon name={setLanguageIcon(note)} size={24} strokeWidth={1} className={`${pathname === `/workspace/${note?.$id}` ? 'text-slate-600' : 'text-slate-300'}`} />} */}
                        {note?.type === "code" && <DynamicIcon name={setLanguageIcon(note)} size={24} strokeWidth={1} className={color} />}

                    </div>

                    <div>
                        <h5 className={`text-md font-semibold line-clamp-1 ${pathname === `/workspace/${note?.$id}` ? 'text-slate-600' : 'text-slate-500'} `}>
                            {note?.title || 'Untitled'}
                        </h5>
                        {note?.subtitle && <h6 className="text-xs text-slate-500 line-clamp-2">{note?.subtitle || 'No subtitle or note written yet'}</h6>}
                        {!note?.subtitle && <p className="text-xs text-slate-500 line-clamp-2">{removeTags(note?.body || 'No subtitle or note written yet')}</p>}
                    </div>
                </Link>
            ))}
        </>
    );
}

export default NoteSwitcher;