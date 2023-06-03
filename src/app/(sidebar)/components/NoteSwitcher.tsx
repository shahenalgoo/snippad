'use client';

import { FC } from "react";
import { Note } from "@/types/typings";

import { TbTrash } from "react-icons/tb";
import Link from "next/link";

interface NoteSwitcherProps {
    noteList: Note[] | null;
}

const NoteSwitcher: FC<NoteSwitcherProps> = ({ noteList }) => {

    // Remove HTML tags from string
    const removeTags = (text: string | undefined) => {
        if (text == null || undefined || '') return '';

        const newText = new DOMParser().parseFromString(text, 'text/html');
        return newText.body.textContent?.substring(0, 120) || "";
    }

    return (
        <>
            {noteList?.map((note: Note | null) => (
                <div key={note?.$id} className="py-6 px-4 w-full border-b border-neutral-200">
                    <Link href={`/workspace/${note?.$id}`} title={note?.title}>
                        <h5 className="text-md font-semibold line-clamp-1">{note?.title}</h5>
                        {note?.subtitle && <h6 className="text-xs text-slate-500 line-clamp-2">{note?.subtitle}</h6>}
                        {!note?.subtitle && <p className="text-xs text-slate-500 line-clamp-2">{removeTags(note?.body)}</p>}
                    </Link>
                </div>
            ))}
        </>
    );
}

export default NoteSwitcher;