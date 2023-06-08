/**
 * Displays a header with options: save, move to, star, archive, trash
 * 
 */

'use client';

// React
import { Dispatch, FC, SetStateAction, useCallback, useEffect, useState } from "react";
import { useRouter } from 'next/navigation';

// Typings
import { Note } from "@/types/typings";
import { NoteStatus } from "@/types/enums";

// Hooks
import { useUser } from "@/context/SessionContext";
import { useDocumentUpdate } from "@/hooks";
import { useNotebook } from "@/context/NotebookContext";

// Components
import { Button } from "@/components";

// Icons
import { TbLoader2, TbTrash, TbTrashFilled } from "react-icons/tb";
import { HiOutlineArchiveBox, HiArchiveBox } from "react-icons/hi2";

// Appwrite
import { AppwriteIds } from "@/lib/appwrite-config";
import { Permission, Role } from "appwrite";

// Header notes components
import SaveNote from "./components/SaveNote";
import StarNote from "./components/StarNote";
import MoveNote from "./components/MoveNote";


interface HeaderNotesProps {
    note: Note | null;
    isStarred: boolean;
    setStarred: Dispatch<SetStateAction<boolean>>;
    status: NoteStatus | null;
    setStatus: Dispatch<SetStateAction<NoteStatus | null>>;
    isSaving: boolean;
}


const HeaderNotes: FC<HeaderNotesProps> = ({ note, isSaving, isStarred, setStarred, status, setStatus }) => {

    // States
    //
    const [isLoadingArchive, setIsLoadingArchive] = useState<boolean>(false);
    const [isLoadingTrash, setIsLoadingTrash] = useState<boolean>(false);


    // Hooks
    //
    const router = useRouter();
    const { user } = useUser();
    const { updateDocument } = useDocumentUpdate(AppwriteIds.collectionId_notes);
    const { fetchNotes } = useNotebook();

    // Mark a Note as Published or Archived or Trashed
    //
    const updateNoteStatus = (newStatus: NoteStatus, setLoading: Dispatch<SetStateAction<boolean>>) => {
        setLoading(true);

        if (user && note) {
            updateDocument({
                document_id: note.$id,
                data: {
                    status: newStatus,
                    status_last_update: new Date(),
                } as Note,
                permission: [
                    Permission.read(Role.user(user.$id)),
                    Permission.update(Role.user(user.$id)),
                    Permission.delete(Role.user(user.$id)),
                ],
                onSuccess() {
                    setStatus(newStatus);
                    setLoading(false);
                    fetchNotes();

                    if (note.status !== NoteStatus.published) {
                        newStatus === NoteStatus.published ? window.location.reload() : router.push('/workspace');
                    } else {
                        router.push('/workspace');
                    }
                },
                onError() {
                    setLoading(false);
                }
            });
        }
    };

    // Archive
    const handleArchive = () => {
        updateNoteStatus(status === NoteStatus.archived ? NoteStatus.published : NoteStatus.archived, setIsLoadingArchive);
    }

    // Trash
    const handleTrash = () => {
        updateNoteStatus(status === NoteStatus.trashed ? NoteStatus.published : NoteStatus.trashed, setIsLoadingTrash);
    }


    return (
        <div className="fixed top-3 right-3 z-40 rounded-full py-1 px-2 bg-neutral-200">
            <SaveNote
                note={note}
                isSaving={isSaving}
            />

            <MoveNote
                note={note}
                isSaving={isSaving}
            />

            <StarNote
                note={note}
                isStarred={isStarred}
                setStarred={setStarred}
                isSaving={isSaving}
            />

            <Button variant='bubble' type="button" onClick={handleArchive} disabled={isSaving}>
                {!isLoadingArchive && status !== NoteStatus.archived && <HiOutlineArchiveBox size={20} strokeWidth={1} />}
                {!isLoadingArchive && status === NoteStatus.archived && <HiArchiveBox size={20} strokeWidth={1} />}
                {isLoadingArchive && <TbLoader2 size={20} className="opacity-40 animate-spin" />}
            </Button>

            <Button variant='bubble' type="button" onClick={handleTrash} disabled={isSaving}>
                {!isLoadingTrash && status !== NoteStatus.trashed && <TbTrash size={20} strokeWidth={1} />}
                {!isLoadingTrash && status === NoteStatus.trashed && <TbTrashFilled size={20} strokeWidth={1} />}
                {isLoadingTrash && <TbLoader2 size={20} className="opacity-40 animate-spin" />}
            </Button>
        </div>
    );
}

export default HeaderNotes;