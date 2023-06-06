'use client';

// React
import { Dispatch, FC, SetStateAction, useCallback, useEffect, useState } from "react";
import { useRouter } from 'next/navigation';

import { Button } from "@/components";

import { TbDeviceFloppy, TbLoader2, TbStar, TbStarFilled, TbTrash, TbArchive, TbTrashFilled } from "react-icons/tb";
import { HiOutlineArchiveBox, HiArchiveBox } from "react-icons/hi2";
import { Note } from "@/types/typings";
import { NoteStatus } from "@/types/enums";
import StarNote from "./StarNote";
import SaveNote from "./SaveNote";
import { useDocumentUpdate } from "@/hooks";
import { AppwriteIds } from "@/lib/appwrite-config";
import { useUser } from "@/context/SessionContext";
import { Permission, Role } from "appwrite";


interface NoteHeaderProps {
    editor: any;
    note: Note | null;
    isStarred: boolean;
    setStarred: Dispatch<SetStateAction<boolean>>;
    status: NoteStatus | null;
    setStatus: Dispatch<SetStateAction<NoteStatus | null>>;
    isSaving: boolean;
}


const NoteHeader: FC<NoteHeaderProps> = ({ editor, note, isSaving, isStarred, setStarred, status, setStatus }) => {

    // States
    //
    const [isLoadingArchive, setIsLoadingArchive] = useState<boolean>(false);
    const [isLoadingTrash, setIsLoadingTrash] = useState<boolean>(false);


    // Hooks
    //
    const router = useRouter();
    const { user } = useUser();
    const { updateDocument } = useDocumentUpdate(AppwriteIds.collectionId_notes);

    // TODO: Move a Note

    // Mark a Note as Published or Archived or Trashed
    //
    const updateNoteStatus = (newStatus: NoteStatus, setLoading: Dispatch<SetStateAction<boolean>>) => {
        setLoading(true);

        if (user && note) {
            updateDocument({
                document_id: note.$id,
                data: {
                    status: newStatus
                } as Note,
                permission: [
                    Permission.read(Role.user(user.$id)),
                    Permission.update(Role.user(user.$id)),
                    Permission.delete(Role.user(user.$id)),
                ],
                onSuccess() {
                    setStatus(newStatus);
                    setLoading(false);

                    if (note.status === NoteStatus.published) {
                        router.push('/workspace');
                    } else {
                        window.location.reload();
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
        updateNoteStatus(status === NoteStatus.trashed ? NoteStatus.published : NoteStatus.trashed, setIsLoadingTrash)
    }


    return (
        <div className="fixed top-3 right-3 z-40 rounded-full py-1 px-2 bg-slate-200">
            <SaveNote
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

export default NoteHeader;