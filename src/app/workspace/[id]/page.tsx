/**
 * CODE & NOTE PAGE
 * 
 */

'use client';

// React
import { useCallback, useEffect, useRef, useState } from "react";
import { notFound } from "next/navigation";

// Typings
import { Note, NoteFormData } from "@/types/typings";
import { NoteStatus, NoteType, NotebookType } from "@/types/enums";

// Hooks
import { useUser } from "@/context/SessionContext";
import { useNotebook } from "@/context/NotebookContext";
import { useDocumentUpdate } from "@/hooks";
import { useUnsavedChangesWarning } from "@/hooks";
import { useCTRLS } from "@/hooks/";

// Database
import { AppwriteIds, client, databases, functions } from "@/lib/appwrite-config";

// Components
import LoadingComponent from "@/components/misc/Loading";
import NoteActionBar from "../components/editor-action-bar/NoteActionBar";

// Editors
import TextareaAutosize from 'react-textarea-autosize';
import CodeEditor from "../components/editor-code/CodeEditor";
import TextEditor from "../components/editor-text/TextEditor";
import TodoEditor from "../components/editor-todo/TodoEditor";

// Utils
import { toast } from "react-hot-toast";

// Notice
import NoticeTrashAutodeletion from "../components/notices/NoticeTrashAutodeletion";
import NoticeCannotEdit from "../components/notices/NoticeCannotEdit";


// Type Definitions
//
type PageProps = {
    params: {
        id: string;
    }
}

const NotePage = ({ params: { id } }: PageProps) => {

    // States
    //
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isSaving, setIsSaving] = useState<boolean>(false);

    const [note, setNote] = useState<Note | null>(null);
    const [starred, setStarred] = useState<boolean>(false);
    const [status, setStatus] = useState<NoteStatus | null>(null);
    const [hasTextChanged, setHasTextChanged] = useState<boolean>(false);

    const [characterCount, setCharacterCount] = useState<number>(0);
    const [wordCount, setWordCount] = useState<number>(0);

    const [changeDetector, setChangeDetector] = useState<boolean>(false);

    // Used for sharing notes with people
    const [shareEmail, setShareEmail] = useState<string | null>(null);

    // Refs
    //
    const beforeSave = useRef<NoteFormData>({
        title: '',
        subtitle: '',
        body: '',
        snippet_language: '',
        status: NoteStatus.published
    });

    const formData = useRef<NoteFormData>({
        title: '',
        subtitle: '',
        body: '',
        snippet_language: '',
        status: NoteStatus.published
    });


    //Hooks
    //
    const { activeNotebook } = useNotebook();
    const { updateDocument } = useDocumentUpdate(AppwriteIds.collectionId_notes);
    const { user } = useUser();


    // Fetch Note
    //
    const fetchNote = useCallback(async (id: string) => {

        setIsLoading(true);

        try {
            const res: Note = await databases.getDocument(
                AppwriteIds.databaseId,
                AppwriteIds.collectionId_notes,
                id
            );

            setNoteData(res);

            return res;
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }

    }, []);


    // Set note data
    //
    const setNoteData = (note: Note) => {
        setNote(note);
        setStarred(note.starred);
        setStatus(note.status);

        formData.current = {
            title: note.title,
            subtitle: note.subtitle,
            body: note.body,
            snippet_language: note.snippet_language,
            status: note.status
        }

        beforeSave.current = {
            title: note.title,
            subtitle: note.subtitle,
            body: note.body,
            snippet_language: note.snippet_language,
            status: note.status

        }
    }


    // Share note with user
    //
    const shareNote = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!user) return;

        // Only owners can share
        if (!note?.$permissions[0].includes(user.$id)) {
            toast.error("Only available for owner");
            return;
        }

        // Not share with own user
        if (shareEmail === user.email) {
            toast.error("Cannot share with yourself");
        }

        // Forming payload to send function
        const payload = {
            owner: user.$id,
            // email: "landingpage@example.com",
            email: shareEmail,
            note: id
        }

        // Calling a server function to add the user 
        //
        const res = await functions.createExecution(process.env.NEXT_PUBLIC_FUNCTION_SHARE_NOTE as string, JSON.stringify(payload));

        // Share response
        //
        switch (res.statusCode) {
            case 200:
                toast.success("Successfully shared!");
                break;
            case 500:
                toast.error("Could not share");
                break;
            default:
                break;
        }
    }

    // Save Note
    //
    async function saveNote(manualSave?: boolean) {
        if (isSaving) return;

        // Allow save only on published notes
        if (formData.current.status != NoteStatus.published) return;


        // If no change happened, no need to save
        if (!noteChanged()) {
            return manualSave ? toast.error('No changes found') : null;
        }

        setIsSaving(true);

        await updateDocument({
            document_id: id,
            data: {
                title: formData?.current.title,
                subtitle: formData?.current.subtitle,
                body: formData?.current.body,
                snippet_language: formData.current.snippet_language,
                search_index: formData?.current.title + ' ' + formData?.current.subtitle + ' ' + formData?.current.body,
                last_change_by: user?.$id
            } as Note,
            onSuccess() {
                // Updating 'before save' data to updated data
                beforeSave.current.title = formData.current.title;
                beforeSave.current.subtitle = formData.current.subtitle;
                beforeSave.current.body = formData.current.body;
                beforeSave.current.snippet_language = formData.current.snippet_language;
                beforeSave.current.status = formData.current.status;

                setHasTextChanged(false);
                noteChanged();

                if (manualSave) toast.success("Note saved!");
            },
            onError() {
                toast.error("Unable to save note");
            }
        });

        setIsSaving(false);
    }


    // Check if any changes occured in note
    //
    const noteChanged = () => {
        if (formData.current.title == beforeSave.current.title &&
            formData.current.subtitle == beforeSave.current.subtitle &&
            formData.current.body == beforeSave.current.body &&
            formData.current.snippet_language == beforeSave.current.snippet_language
        ) {
            return false;
        } else {
            return true
        }
    }

    // Adding before unloading warning event, in case there are unsaved changes.
    //
    useUnsavedChangesWarning(hasTextChanged && note?.status === NoteStatus.published);


    // Enabling saving with CTRL+S, also saves on unmount resulting into the auto-save feature
    //
    useCTRLS(saveNote);


    // Use effect - Fetch note
    //
    useEffect(() => {
        fetchNote(id);

        // Realtime not required for personal notebooks
        if (activeNotebook?.type === NotebookType.personal) return;

        // Subscribe to live changes for the user's notebook collection
        const subscribe = client.subscribe(`databases.${AppwriteIds.databaseId}.collections.${AppwriteIds.collectionId_notes}.documents.${id}`, res => {
            // Getting ref to event note
            let eventNote: Note = res.payload as Note;

            // Do not apply change if user is the last updater
            if (eventNote.last_change_by === user?.$id) {
                return;
            }

            // Update data received from realtime
            setNoteData(eventNote);

            let titleElement = document.getElementById("title");
            if (titleElement) titleElement.textContent = eventNote.title;

            let subtitleElement = document.getElementById("subtitle");
            if (subtitleElement) subtitleElement.textContent = eventNote.subtitle;

            // This is used by editors to change BODY
            setChangeDetector((prev) => !prev);
        });

        return () => {
            // Unsubscribe on unmount
            subscribe();
        }

    }, [fetchNote, id, activeNotebook]);


    // If note not found, return 404
    //
    if (!isLoading && !note) {
        return notFound();
    }


    return (
        <>
            {isLoading &&
                <LoadingComponent />
            }

            {!isLoading &&
                <NoteActionBar
                    note={note}
                    isSaving={isSaving}
                    saveNote={saveNote}
                    isStarred={starred}
                    setStarred={setStarred}
                    status={status}
                    setStatus={setStatus}
                    characterCount={characterCount}
                    wordCount={wordCount}

                    shareNote={shareNote}
                    shareEmail={shareEmail}
                    setShareEmail={setShareEmail}
                />
            }

            <div className="py-28">

                {/* Notices on Archived and Trashed notes */}
                {!isLoading &&
                    <NoticeTrashAutodeletion note={note} />
                }
                {!isLoading &&
                    <NoticeCannotEdit note={note} />
                }

                {/* Editor Fields */}
                <div className="mb-1">
                    <TextareaAutosize
                        id="title"
                        placeholder="Title"
                        defaultValue={note?.title}
                        onChange={(e) => {
                            formData.current.title = e.target.value;
                            activeNotebook?.type === NotebookType.shared ? saveNote() : setHasTextChanged(noteChanged() ? true : false);
                        }}


                        className="w-full bg-transparent outline-none text-3xl sm:text-4xl font-semibold resize-none overflow-auto disabled:cursor-not-allowed dark:placeholder:text-neutral-600"
                        disabled={note?.status !== NoteStatus.published}
                    />
                </div>

                <div className="mb-10">
                    <TextareaAutosize
                        id="subtitle"
                        placeholder="Subtitle"
                        defaultValue={note?.subtitle}
                        onChange={(e) => {
                            formData.current.subtitle = e.target.value;
                            activeNotebook?.type === NotebookType.shared ? saveNote() : setHasTextChanged(noteChanged() ? true : false);
                        }}
                        className="w-full bg-transparent outline-none text-xl sm:text-2xl font-medium resize-none overflow-auto text-neutral-500 disabled:cursor-not-allowed dark:placeholder:text-neutral-600"
                        disabled={note?.status !== NoteStatus.published}
                    />
                </div>

                {!isLoading && note?.type === NoteType.note &&
                    < TextEditor
                        note={note}
                        onUpdateFormBody={(newBody: string) => {
                            formData.current.body = newBody;
                            activeNotebook?.type === NotebookType.shared ? saveNote() : setHasTextChanged(noteChanged() ? true : false);
                        }}
                        noteStatus={status}
                        setCharacterCount={setCharacterCount}
                        setWordCount={setWordCount}
                        changeDetector={changeDetector}
                        body={formData.current.body}
                    />
                }

                {!isLoading && note?.type === NoteType.code &&

                    <CodeEditor
                        note={note}
                        onUpdateFormBody={(newBody: string) => {
                            formData.current.body = newBody;
                            activeNotebook?.type === NotebookType.shared ? saveNote() : setHasTextChanged(noteChanged() ? true : false);
                        }}
                        onUpdateFormLanguage={(newLanguage: string) => {
                            formData.current.snippet_language = newLanguage;
                            activeNotebook?.type === NotebookType.shared ? saveNote() : setHasTextChanged(noteChanged() ? true : false);
                        }}
                        changeDetector={changeDetector}
                        body={formData.current.body}
                    />
                }

                {!isLoading && note?.type === NoteType.todo &&
                    <TodoEditor
                        note={note}
                        onUpdateFormBody={(newBody: string) => {
                            formData.current.body = newBody;
                            setHasTextChanged(noteChanged() ? true : false);
                        }}
                        changeDetector={changeDetector}
                        body={formData.current.body}

                    />
                }

            </div>

        </>

    );
}

export default NotePage;