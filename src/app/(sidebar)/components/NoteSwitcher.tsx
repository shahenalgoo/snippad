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
            {noteList?.map((note: any) => (
                <div key={note.$id} className="mb-4 py-2 px-4 w-full rounded-lg border border-neutral-800">
                    <Link href={`/workspace/${note.$id}`}>
                        <h4>{note.title}</h4>
                    </Link>
                </div>
            ))}
        </>
    );
}

export default NoteSwitcher;