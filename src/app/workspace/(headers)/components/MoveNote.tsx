// React
import { FC, useState } from "react";
import { Note, Notebook } from "@/types/typings";

// Icons
import { TbArrowsLeftRight, TbCircle, TbCircleCheckFilled, TbLoader2 } from "react-icons/tb";

// Components
import { Button } from "@/components";

// Hooks
import { useUser } from "@/context/SessionContext";
import { useNotebook } from "@/context/NotebookContext";
import { useDocumentUpdate } from "@/hooks";

// Appwrite
import { AppwriteIds } from "@/lib/appwrite-config";
import { Permission, Role } from "appwrite";
import { toast } from "react-hot-toast";

interface MoveNoteProps {
    note: Note | null
    isSaving: boolean
}

const MoveNote: FC<MoveNoteProps> = ({
    note,
    isSaving
}) => {

    // States
    //
    const [isLoadingMove, setIsLoadingMove] = useState<boolean>(false);
    const [notebookDropdown, setNotebookDropdown] = useState<boolean>(false);

    // Hooks
    //
    const { user } = useUser();
    const { collection: notebookList, activeNotebook, activateNotebook } = useNotebook();
    const { updateDocument } = useDocumentUpdate(AppwriteIds.collectionId_notes);

    // Move Note
    //
    const moveNote = (newNotebook: Notebook) => {
        setIsLoadingMove(true);
        setNotebookDropdown(!notebookDropdown);

        if (user && note) {
            updateDocument({
                document_id: note.$id,
                data: {
                    notebook_related: newNotebook.$id,
                } as Note,
                permission: [
                    Permission.read(Role.user(user.$id)),
                    Permission.update(Role.user(user.$id)),
                    Permission.delete(Role.user(user.$id)),
                ],
                onSuccess() {
                    setIsLoadingMove(false);
                    activateNotebook(newNotebook);
                    toast.success('Successfully moved');
                },
                onError() {
                    setIsLoadingMove(false);
                    toast.error('Unable to move note');
                }
            });
        }
    };

    return (
        <>
            <Button variant='bubble' type="button" onClick={() => setNotebookDropdown(!notebookDropdown)} disabled={isSaving}>
                {!isLoadingMove && <TbArrowsLeftRight size={20} strokeWidth={1} />}
                {isLoadingMove && <TbLoader2 size={20} className="opacity-40 animate-spin" />}
            </Button>

            <div className={`absolute left-0 z-50 w-[300px] h-auto p-1 transition-all rounded-lg bg-white border border-neutral-300 shadow-md ${!notebookDropdown ? 'invisible opacity-0 top-8' : 'visible opacity-100 top-16'} `}>
                {!isLoadingMove && notebookList?.map((notebook: Notebook) => (
                    <button key={notebook.$id} onClick={() => moveNote(notebook)} className="flex items-center w-full py-3 px-3 rounded-md transition-all bg-transparent hover:bg-neutral-100">
                        {note?.notebook_related === notebook.$id ?
                            <TbCircleCheckFilled size={20} strokeWidth={1} className="mr-3 text-primary" />
                            :
                            <TbCircle size={20} strokeWidth={1} className="mr-3 text-slate-300" />
                        }
                        <span className="text-sm font-semibold font-sans">{notebook.title}</span>
                    </button>
                ))}
            </div>
        </>

    );
}

export default MoveNote;