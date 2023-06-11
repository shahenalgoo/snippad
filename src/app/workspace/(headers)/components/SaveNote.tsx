import { Button, Spinner } from "@/components";
import { Note } from "@/types/typings";
import { FC } from "react";
import { TbDeviceFloppy, TbLoader2 } from "react-icons/tb";

interface SaveNoteProps {
    note: Note | null
    isSaving: boolean
}

const SaveNote: FC<SaveNoteProps> = ({ note, isSaving }) => {
    return (
        <Button variant='primary' rounded='full' type="submit" disabled={isSaving}>
            {!isSaving && <TbDeviceFloppy size={24} strokeWidth={1} />}
            {isSaving && <Spinner variant='button' />}
            <span className="ml-2 hidden lg:block">Save</span>
        </Button>
    );
}

export default SaveNote;