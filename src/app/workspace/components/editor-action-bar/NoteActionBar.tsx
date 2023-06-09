/**
 * Displays a header with options: save, move to, star, archive, trash
 * 
 */

'use client';

// React
import { Dispatch, FC, SetStateAction, useState } from "react";
import { useRouter } from 'next/navigation';

// Typings
import { Note } from "@/types/typings";
import { NoteStatus, NoteType, NotebookType } from "@/types/enums";

// Hooks
import { useDocumentUpdate } from "@/hooks";
import { useNotebook } from "@/context/NotebookContext";
import { useUser } from "@/context/SessionContext";

// Components
import { Button } from "@/components";

// Icons
import { TbCheck, TbLoader2, TbRotateRectangle, TbShare2, TbTrash } from "react-icons/tb";
import { HiOutlineArchiveBox } from "react-icons/hi2";

// Appwrite
import { AppwriteIds } from "@/lib/appwrite-config";

// Header notes components
import SaveNote from "./SaveNote";
import StarNote from "./StarNote";
import MoveNote from "./MoveNote";
import ShareNote from "./ShareNote";
import CharacterCount from "./CharacterCount";


interface NoteActionBarProps {
    note: Note | null;
    isSaving: boolean;
    saveNote: (manualSave?: boolean) => void;
    isStarred: boolean;
    setStarred: Dispatch<SetStateAction<boolean>>;
    status: NoteStatus | null;
    setStatus: Dispatch<SetStateAction<NoteStatus | null>>;
    characterCount: number;
    wordCount: number;

    // Share notes
    shareNote: (e: React.FormEvent<HTMLFormElement>) => void;
    shareEmail: string | null;
    setShareEmail: Dispatch<SetStateAction<string | null>>
}


const NoteActionBar: FC<NoteActionBarProps> = ({
    note,
    isSaving, saveNote,
    isStarred, setStarred,
    status, setStatus,
    characterCount, wordCount,

    shareNote,
    shareEmail,
    setShareEmail
}) => {

    // States
    //
    const [isLoadingArchive, setIsLoadingArchive] = useState<boolean>(false);
    const [isLoadingTrash, setIsLoadingTrash] = useState<boolean>(false);


    // Hooks
    //
    const router = useRouter();
    const { user } = useUser();
    const { activeNotebook } = useNotebook();
    const { updateDocument } = useDocumentUpdate(AppwriteIds.collectionId_notes);
    const { fetchNotes } = useNotebook();


    // Mark a Note as Published or Archived or Trashed
    //
    const updateNoteStatus = (newStatus: NoteStatus, setLoading: Dispatch<SetStateAction<boolean>>) => {
        setLoading(true);

        if (!note) return;

        updateDocument({
            document_id: note.$id,
            data: {
                status: newStatus,
                status_last_update: new Date(),
            } as Note,
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
        <div className="fixed bottom-4 left-0 z-20 w-full flex justify-center lg:z-40 lg:bottom-auto lg:w-auto lg:left-auto lg:top-[6px] lg:right-[70px]">

            {/* Character & Word Count */}
            {note?.type === NoteType.note &&
                <CharacterCount
                    characterCount={characterCount}
                    wordCount={wordCount}
                />
            }


            {/* Save - Move - Star - Archive... */}
            <div className="rounded-full py-1 px-2 flex items-center gap-2 backdrop-blur-md bg-black/5 dark:bg-white/5">
                {note?.status === NoteStatus.published &&
                    <SaveNote
                        isSaving={isSaving}
                        saveNote={saveNote}
                    />
                }

                {note?.status === NoteStatus.archived &&
                    <Button onClick={handleArchive} variant='black' rounded='full' className="mr-2">
                        <TbRotateRectangle size={18} strokeWidth={2} className={`mr-2 ${isLoadingArchive && 'animate-spin'}`} />
                        Recover
                    </Button>
                }

                {note?.status === NoteStatus.trashed &&
                    <Button onClick={handleTrash} variant='black' rounded='full' className="mr-2">
                        <TbRotateRectangle size={18} strokeWidth={2} className={`mr-2 ${isLoadingTrash && 'animate-spin'}`} />
                        Recover
                    </Button>
                }

                <MoveNote
                    note={note}
                    isSaving={isSaving}
                    saveNote={saveNote}
                />

                <StarNote
                    note={note}
                    isStarred={isStarred}
                    setStarred={setStarred}
                    isSaving={isSaving}
                />

                {note?.status !== NoteStatus.archived &&
                    <Button variant='inverted' type="button" onClick={handleArchive} disabled={isSaving}>
                        {!isLoadingArchive && status !== NoteStatus.archived && <HiOutlineArchiveBox size={20} strokeWidth={1} />}
                        {!isLoadingArchive && status === NoteStatus.archived && <TbCheck size={20} strokeWidth={1} />}
                        {isLoadingArchive && <TbLoader2 size={20} className="opacity-40 animate-spin" />}
                    </Button>
                }

                {note?.status !== NoteStatus.trashed &&
                    <Button variant='inverted' type="button" onClick={handleTrash} disabled={isSaving}>
                        {!isLoadingTrash && status !== NoteStatus.trashed && <TbTrash size={20} strokeWidth={1} />}
                        {!isLoadingTrash && status === NoteStatus.trashed && <TbCheck size={20} strokeWidth={2} />}
                        {isLoadingTrash && <TbLoader2 size={20} className="opacity-40 animate-spin" />}
                    </Button>
                }
            </div>


            {/* Share Doc */}
            {user && activeNotebook?.type === NotebookType.shared && note?.$permissions[0].includes(user.$id) &&
                <ShareNote
                    shareNote={shareNote}
                    shareEmail={shareEmail}
                    setShareEmail={setShareEmail}
                />
            }

        </div>
    );
}

export default NoteActionBar;