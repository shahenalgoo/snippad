import { useDocumentDelete } from "@/hooks";
import { AppwriteIds } from "@/lib/appwrite-config";
import { Note } from "@/types/typings";
import { FC } from "react";
import { useRouter } from "next/navigation"
import { useNotebook } from "@/context/NotebookContext";
import { Button } from "@/components";

interface DeletePermanentlyProps {
    note: Note | null;
}

const DeletePermanently: FC<DeletePermanentlyProps> = ({ note }) => {


    // Hooks
    //
    const router = useRouter();
    const { deleteDocument } = useDocumentDelete(AppwriteIds.collectionId_notes);
    const { fetchNotes } = useNotebook();

    // Delete a trashed note permanently
    //
    const permanentDelete = () => {
        deleteDocument({
            document_id: note?.$id,
            onSuccess() {
                fetchNotes();
                router.push('/workspace');
            }
        })
    }

    return (
        <>
            <Button onClick={permanentDelete} variant='danger' rounded='full'>
                Delete Permanently
            </Button>
        </>
    );
}

export default DeletePermanently;