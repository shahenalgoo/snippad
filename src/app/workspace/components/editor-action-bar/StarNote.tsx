// React
import { Dispatch, FC, SetStateAction, useState } from "react";

// Typings
import { Note } from "@/types/typings";

// Hooks
import { useNotebook } from "@/context/NotebookContext";
import { useDocumentUpdate } from "@/hooks";

// Components
import { Button } from "@/components";

// Appwrite
import { AppwriteIds } from "@/lib/appwrite-config";

// Icons
import { TbLoader2, TbStar, TbStarFilled } from "react-icons/tb";


interface StarNoteProps {
    note: Note | null
    isSaving: boolean
    isStarred: boolean;
    setStarred: Dispatch<SetStateAction<boolean>>;
}

const StarNote: FC<StarNoteProps> = ({
    note,
    isSaving,
    isStarred,
    setStarred
}) => {

    // States
    //
    const [isLoadingStarred, setIsLoadingStarred] = useState<boolean>(false);


    // Hooks
    //
    const { updateDocument } = useDocumentUpdate(AppwriteIds.collectionId_notes);
    const { fetchNotes } = useNotebook();

    // Mark a Note as Starred
    //
    const starNote = () => {
        if (!note) return;

        setIsLoadingStarred(true);

        updateDocument({
            document_id: note.$id,
            data: {
                starred: !isStarred,
            } as Note,
            onSuccess() {
                setStarred((prev) => !prev);
                setIsLoadingStarred(false);
                fetchNotes();
            },
            onError() {
                setIsLoadingStarred(false);
            }
        });
    };


    return (
        <Button variant='inverted' type="button" onClick={starNote} disabled={isSaving}>
            {!isLoadingStarred && !isStarred && <TbStar size={20} strokeWidth={1} />}
            {!isLoadingStarred && isStarred && <TbStarFilled size={20} strokeWidth={1} className="text-star" />}
            {isLoadingStarred && <TbLoader2 size={20} className="opacity-40 animate-spin" />}
        </Button>
    );
}

export default StarNote;