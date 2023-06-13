// React
import { FC, MouseEventHandler } from "react";

// Typings
import { Note } from "@/types/typings";

// Components
import { Button, Spinner } from "@/components";

// Icons
import { TbDeviceFloppy } from "react-icons/tb";

interface SaveNoteProps {
    isSaving: boolean;
    saveNote: (manualSave?: boolean) => void;
}

const SaveNote: FC<SaveNoteProps> = ({ isSaving, saveNote }) => {
    return (
        <Button onClick={() => saveNote(true)} variant='primary' rounded='full' disabled={isSaving}>
            {!isSaving && <TbDeviceFloppy size={24} strokeWidth={1} />}
            {isSaving && <Spinner variant='button' />}
            <span className="ml-2 hidden lg:block">Save</span>
        </Button>
    );
}

export default SaveNote;