import { Dispatch, FC, SetStateAction, useState } from "react";
import { Note, Notebook } from "@/types/typings";

import { useUser } from "@/context/SessionContext";
import { useDocumentUpdate } from "@/hooks";

import { Button } from "@/components";

import { AppwriteIds } from "@/lib/appwrite-config";
import { Permission, Role } from "appwrite";

import { TbLoader2, TbStar, TbStarFilled, TbStatusChange } from "react-icons/tb";
import { useNotebook } from "@/context/NotebookContext";


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


    // Mark a Note as Starred
    //
    const moveNote = (newNotebook: Notebook) => {
        setIsLoadingMove(true);

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
                },
                onError() {
                    setIsLoadingMove(false);
                }
            });
        }
    };


    return (
        <>

            <Button variant='bubble' type="button" onClick={() => setNotebookDropdown(!notebookDropdown)} disabled={isSaving}>
                {!isLoadingMove && <TbStatusChange size={20} strokeWidth={1} />}
                {isLoadingMove && <TbLoader2 size={20} className="opacity-40 animate-spin" />}
            </Button>

            <div className={`absolute left-0 z-50 w-full h-auto p-3 transition-all ${!notebookDropdown ? 'invisible opacity-0 top-8' : 'visible opacity-100 top-16'} `}>
                <div className="overflow-hidden w-full bg-white rounded-lg">

                    {notebookList?.filter((el: Notebook) => note?.notebook_related != el.$id).map((notebook: Notebook) => (
                        <button key={notebook.$id} onClick={() => moveNote(notebook)} className="flex items-center w-full p-4 transition-all border-b border-border-light last:border-none hover:bg-slate-100">
                            {/* {activeNotebook?.$id === notebook.$id ?
                                <TbCircleCheckFilled size={20} strokeWidth={1} className="mr-3 text-primary" />
                                :
                                <TbCircle size={20} strokeWidth={1} className="mr-3 text-slate-300" />
                            } */}
                            <span className="text-sm font-semibold">{notebook.title}</span>
                        </button>
                    ))}

                </div>
            </div>
        </>

    );
}

export default MoveNote;