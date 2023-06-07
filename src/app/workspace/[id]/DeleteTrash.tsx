import { useDocumentDelete } from "@/hooks";
import { AppwriteIds } from "@/lib/appwrite-config";
import { Note } from "@/types/typings";
import { FC } from "react";
import { useRouter } from "next/navigation"

interface DeleteTrashProps {
    note: Note;
}

const DeleteTrash: FC<DeleteTrashProps> = ({ note }) => {

    const router = useRouter();

    const { deleteDocument } = useDocumentDelete(AppwriteIds.collectionId_notes);


    const permanentDelete = () => {
        deleteDocument({
            document_id: note.$id,
            onSuccess() {
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