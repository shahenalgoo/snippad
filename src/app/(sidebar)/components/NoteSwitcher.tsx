'use client';

import { FC } from "react";
import { usePathname } from 'next/navigation';
import { Note } from "@/types/typings";

import { TbNotes, TbCode } from "react-icons/tb";
import Link from "next/link";

interface NoteSwitcherProps {
    noteList: Note[] | null;
}

const NoteSwitcher: FC<NoteSwitcherProps> = ({ noteList }) => {

    // Current path
    //
    const pathname = usePathname();


    // Remove HTML tags from string
    const removeTags = (text: string | undefined) => {
        if (text == null || undefined || '') return '';

        const newText = new DOMParser().parseFromString(text, 'text/html');
        return newText.body.textContent?.substring(0, 120) || "";
    }

    return (
        <>
            {noteList?.map((note: Note | null) => (
                <Link key={note?.$id} href={`/workspace/${note?.$id}`} title={note?.title} className={`flex items-center w-full rounded-lg mb-2 py-4 px-4 border  ${pathname === `/workspace/${note?.$id}` ? 'bg-slate-100 border-primary' : 'border-transparent'}`}>

                    <div className="w-10 h-10 flex items-center">
                        {note?.type === "note" && <TbNotes size={24} strokeWidth={1} className={`${pathname === `/workspace/${note?.$id}` ? 'text-slate-600' : 'text-slate-300'}`} />}
                        {note?.type === "code" && <TbCode size={24} strokeWidth={1} className={`${pathname === `/workspace/${note?.$id}` ? 'text-slate-600' : 'text-slate-300'}`} />}
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