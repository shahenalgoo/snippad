// React
import { FC } from "react";
import { useRouter } from "next/navigation"

// Typings
import { Note } from "@/types/typings";

// Hooks
import { useNotebook } from "@/context/NotebookContext";
import { useDocumentDelete, useToggle } from "@/hooks";

// Components
import { Button } from "@/components";
import { ConfirmationModal } from "@/components/misc/ConfirmationModal";

// Appwrite
import { AppwriteIds } from "@/lib/appwrite-config";

// Icons
import { TbTrashX } from "react-icons/tb";

interface DeletePermanentlyProps {
    note: Note | null;
}

const DeletePermanently: FC<DeletePermanentlyProps> = ({ note }) => {

    // Hooks
    //
    const router = useRouter();
    const { deleteDocument } = useDocumentDelete(AppwriteIds.collectionId_notes);
    const { fetchNotes } = useNotebook();

    const [modalActive, setModalActive] = useToggle();

    // Delete a trashed note permanently
    //
    const onDelete = () => {
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
            {note && <ConfirmationModal
                confirmationMessage={
                    <p><span className="font-extrabold">{note.title || 'This item'}</span> will be deleted.</p>
                }
                confirmationButton={
                    <Button variant='danger' type="button" onClick={onDelete}>
                        <TbTrashX size={20} strokeWidth={1.5} className="mr-2" />
                        Delete Permanently
                    </Button>
                }
                modalButton={
                    <Button onClick={() => setModalActive(!modalActive)} variant='danger' rounded='full'>
                        Delete Now
                    </Button>
                }
                modalActive={modalActive}
                setModalActive={setModalActive}
            />}
        </>
    );
}

export default DeletePermanently;