import { FC } from "react";
import { Button } from "@/components";

import { TbDeviceFloppy, TbLoader2, TbJewishStar, TbTrash, TbArchive } from "react-icons/tb";
import { Note } from "@/types/typings";

interface NoteHeaderProps {
    editor: any;
    note: Note | null;
    isSaving: boolean
}


const NoteHeader: FC<NoteHeaderProps> = ({ editor, note, isSaving }) => {
    return (
        <div className="fixed top-3 right-3 z-30 rounded-full py-1 px-2 bg-slate-100">
            <Button variant='primary' rounded='full' type="submit" disabled={isSaving} className="mr-3">
                {!isSaving && <TbDeviceFloppy size={20} strokeWidth={1} className="mr-1" />}
                {isSaving && <TbLoader2 size={18} className="mr-1 animate-spin" />}
                Save&nbsp;<span className="capitalize">{note?.type}</span>
            </Button>

            <Button variant='bubble' type="button" disabled={isSaving}>
                <TbJewishStar size={20} strokeWidth={1} />
            </Button>

            <Button variant='bubble' type="button" disabled={isSaving}>
                <TbArchive size={20} strokeWidth={1} />
            </Button>

            <Button variant='bubble' type="button" disabled={isSaving}>
                <TbTrash size={20} strokeWidth={1} />
            </Button>
        </div>
    );
}

export default NoteHeader;