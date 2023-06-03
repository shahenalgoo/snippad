import { Button } from "@/components";
import { Note } from "@/types/typings";
import { FC } from "react";
import { TbDeviceFloppy, TbLoader2 } from "react-icons/tb";

interface SaveNoteProps {
    note: Note | null
    isSaving: boolean
}

const SaveNote: FC<SaveNoteProps> = ({ note, isSaving }) => {
    return (
        <Button variant='primary' rounded='full' type="submit" disabled={isSaving} className="mr-3">
            {!isSaving && <TbDeviceFloppy size={20} strokeWidth={1} className="mr-1" />}
            {isSaving && <TbLoader2 size={18} className="mr-1 animate-spin" />}
            Save&nbsp;<span className="capitalize">{note?.type}</span>
        </Button>
    );
}

export default SaveNote;