'use client';

// React
import { ChangeEvent, Ref, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { notFound } from "next/navigation";

// Typings
import { Note, NoteFormData } from "@/types/typings";
import { NoteStatus, NoteType } from "@/types/enums";

// Hooks
import { useNotebook } from "@/context/NotebookContext";
import { useDocumentUpdate } from "@/hooks";

// Database
import { AppwriteIds, databases } from "@/lib/appwrite-config";

// Note header
import HeaderNotes from "../components/note-action-bar/NoteActionBar";

// Text Editor
import TextareaAutosize from 'react-textarea-autosize';
import TextEditor from "../components/text-editor/TextEditor";
import SnippetEditor from "../components/code-editor/CodeEditor";

// Components
import { Notification } from "@/components";

// Utils
import LoadingComponent from "@/components/misc/Loading";
import { toast } from "react-hot-toast";

//Permanent Delete
import DeletePermanently from "./DeletePermanently";
import { useUnsavedChangesWarning } from "@/hooks";
import { daysLeft } from "@/utils/dates-difference-in-days";


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

            setNote(res);
            setStarred(res.starred);
            setStatus(res.status);

            formData.current = {
                title: res.title,
                subtitle: res.subtitle,
                body: res.body,
                snippet_language: res.snippet_language,
                status: res.status
            }

            beforeSave.current = {
                title: res.title,
                subtitle: res.subtitle,
                body: res.body,
                snippet_language: res.snippet_language,
                status: res.status

            }

            return res;
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }

    }, []);


    // Save Note
    //
    async function saveNote(manualSave?: boolean) {
        if (isSaving) return;

        // Prevent save attempt when permanently deleting a note since saveNote triggers on unmount
        if (formData.current.status != NoteStatus.published) return;

        setIsSaving(true);

        // If no change happened, no need to save
        if (!noteChanged()) {
            setIsSaving(false);
            return manualSave ? toast.error('No changes found') : null;
        }

        updateDocument({
            document_id: id,
            data: {
                title: formData?.current.title,
                subtitle: formData?.current.subtitle,
                body: formData?.current.body,
                snippet_language: formData.current.snippet_language,
                search_index: formData?.current.title + ' ' + formData?.current.subtitle + ' ' + formData?.current.body
            } as Note,
            onSuccess() {
                // Updating before save data
                beforeSave.current.title = formData.current.title;
                beforeSave.current.subtitle = formData.current.subtitle;
                beforeSave.current.body = formData.current.body;
                beforeSave.current.snippet_language = formData.current.snippet_language;
                beforeSave.current.status = formData.current.status;

                setHasTextChanged(false);
                noteChanged();

                if (manualSave) toast.success("Note saved!");
                setIsSaving(false);
            },
            onError() {
                toast.error("Unable to save note");
                setIsSaving(false);
            }
        });
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


    // Update Form Titles, and detect text state changes
    //
    const onUpdateFormTitle = (e: ChangeEvent<HTMLTextAreaElement>, target: string) => {
        switch (target) {
            case "title":
                formData.current.title = e.target.value;
                break;
            case "subtitle":
                formData.current.subtitle = e.target.value;
                break;
            default:
                break;
        }

        setHasTextChanged(noteChanged() ? true : false)
    }

    // Update Form Body, and detect text state changes
    //
    const onUpdateFormBody = (newBody: string) => {
        formData.current.body = newBody;
        setHasTextChanged(noteChanged() ? true : false)
    }
    // Update Form Code Language, and detect text state changes
    //
    const onUpdateFormLanguage = (newLanguage: string) => {
        formData.current.snippet_language = newLanguage;
        setHasTextChanged(noteChanged() ? true : false)
    }

    // Form submit
    //
    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        saveNote(true);
    }


    // Keyboard Events
    //
    const handleKeyDown = useCallback((e: any) => {
        // Save Note - Ctrl + s
        if ((e.ctrlKey && e.key === "S" || e.ctrlKey && e.key === "s")) {
            e.preventDefault();
            saveNote(true);
        }
    }, []);


    // Use effect - Save notes
    //
    useEffect(() => {

        // Register keydown events
        window.addEventListener("keydown", handleKeyDown);

        return () => {
            // De-register keydown events
            window.removeEventListener("keydown", handleKeyDown);

            // Save note when leaving (unmounts)
            saveNote();
        };
    }, [handleKeyDown]);


    // Use effect - Fetch notes
    //
    useEffect(() => {
        fetchNote(id);

    }, [fetchNote, id, activeNotebook]);


    // If note note found, return not-found page
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


                <form onSubmit={onSubmit} className="font-body">

                    <HeaderNotes
                        note={note}
                        isSaving={isSaving}
                        saveNote={saveNote}
                        isStarred={starred}
                        setStarred={setStarred}
                        status={status}
                        setStatus={setStatus}
                    />


                    <div className="py-28">

                        {/* Display amount of days left for trashed notes */}
                        {note?.status === NoteStatus.trashed &&

                            <Notification variant='danger' className="mb-4 flex justify-between items-center">
                                {/* Trashed notes are automatically deleted after 30 days. This note has {daysLeft(note.status_last_update)} day(s) left. */}
                                {daysLeft(note.status_last_update)} day(s) left until automatic deletion.
                                {note?.status === NoteStatus.trashed &&
                                    <DeletePermanently note={note} />
                                }
                            </Notification>
                        }

                        {/* Visible only when a note is archived or trashed */}
                        {note?.status !== NoteStatus.published &&

                            <Notification variant='danger' className="mb-4 flex justify-between items-center">
                                Cannot be edited while {note?.status === NoteStatus.archived ? 'archived' : 'trashed'}.
                            </Notification>
                        }

                        <div className="mb-1">
                            <TextareaAutosize
                                id="title"
                                placeholder="Title"
                                defaultValue={note?.title}
                                onChange={(e) => onUpdateFormTitle(e, "title")}
                                className="w-full bg-transparent outline-none text-3xl sm:text-4xl font-semibold resize-none overflow-auto disabled:cursor-not-allowed"
                                disabled={note?.status !== NoteStatus.published}
                            />
                        </div>

                        <div className="mb-10">
                            <TextareaAutosize
                                id="subtitle"
                                placeholder="Subtitle"
                                defaultValue={note?.subtitle}
                                onChange={(e) => onUpdateFormTitle(e, "subtitle")}

                                className="w-full bg-transparent outline-none text-xl sm:text-2xl font-medium resize-none overflow-auto text-neutral-500 disabled:cursor-not-allowed"
                                disabled={note?.status !== NoteStatus.published}
                            />
                        </div>

                        <div className="relative">

                            {note?.type === NoteType.note &&
                                <TextEditor
                                    note={note}
                                    onUpdateFormBody={onUpdateFormBody}
                                    noteStatus={status}
                                />
                            }

                            {note?.type === NoteType.code &&
                                <SnippetEditor
                                    note={note}
                                    onUpdateFormBody={onUpdateFormBody}
                                    onUpdateFormLanguage={onUpdateFormLanguage}
                                />
                            }
                        </div>
                    </div>

                </form>
            }
        </>
    )
}

export default NotePage;