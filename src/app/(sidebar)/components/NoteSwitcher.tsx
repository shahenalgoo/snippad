'use client';

import { FC } from "react";
import { Note } from "@/types/typings";

import { TbTrash } from "react-icons/tb";
import Link from "next/link";

interface NoteSwitcherProps {
    noteList: Note[] | null;
}

const NoteSwitcher: FC<NoteSwitcherProps> = ({ noteList }) => {

    return (
        <>
            {noteList?.map((note: Note) => (
                <div key={note.$id} className="py-6 px-4 w-full border-b border-neutral-200">
                    <Link href={`/workspace/${note.$id}`} title={note.title}>
                        <h5 className="text-md font-semibold line-clamp-1">{note.title}</h5>
                        {note.subtitle && <h6 className="text-xs text-slate-500 line-clamp-2">{note.subtitle}</h6>}
                        {!note.subtitle && <p className="text-xs text-slate-500 line-clamp-2">{note.body.substring(0, 120)}</p>}
                    </Link>
                </div>
            ))}
        </>
    );
}

export default NoteSwitcher;