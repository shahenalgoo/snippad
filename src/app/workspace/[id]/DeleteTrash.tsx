import { useDocumentDelete } from "@/hooks";
import { AppwriteIds } from "@/lib/appwrite-config";
import { Note } from "@/types/typings";
import { FC } from "react";
import { useRouter } from "next/navigation"
import { useNotebook } from "@/context/NotebookContext";

interface DeleteTrashProps {
    note: Note;
}

const DeleteTrash: FC<DeleteTrashProps> = ({ note }) => {


    // Hooks
    //
    const router = useRouter();
    const { deleteDocument } = useDocumentDelete(AppwriteIds.collectionId_notes);
    const { fetchNotes } = useNotebook();

    // Delete a trashed note permanently
    //
    const permanentDelete = () => {
        deleteDocument({
            document_id: note.$id,
            onSuccess() {
                fetchNotes();
                router.push('/workspace');
            }
        })
    }

    return (
        <>
            <button onClick={permanentDelete}>Permanent Delete</button>
        </>
    );
}

export default DeleteTrash;