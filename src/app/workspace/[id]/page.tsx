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
import { NoteStatus, NoteType } from "@/types/enums";

// Hooks
import { useNotebook } from "@/context/NotebookContext";
import { useDocumentUpdate } from "@/hooks";
import { useUnsavedChangesWarning } from "@/hooks";

// Database
import { AppwriteIds, databases } from "@/lib/appwrite-config";

// Note header
import NoteActionBar from "../components/editor-action-bar/NoteActionBar";

// Text editor
import TextareaAutosize from 'react-textarea-autosize';
import CodeEditor from "../components/editor-code/CodeEditor";
import TextEditor from "../components/editor-text/TextEditor";

// Utils
import LoadingComponent from "@/components/misc/Loading";
import { toast } from "react-hot-toast";

// Workspace components
import NoticeTrashAutodeletion from "../components/notices/NoticeTrashAutodeletion";
import NoticeCannotEdit from "../components/notices/NoticeCannotEdit";
import useCTRLS from "@/hooks/useCTRLS";
import TodoEditor from "../components/editor-todo/TodoEditor";


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
                search_index: formData?.current.title + ' ' + formData?.current.subtitle + ' ' + formData?.current.body
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


    // Use effect - Fetch notes
    //
    useEffect(() => {
        fetchNote(id);
    }, [fetchNote, id, activeNotebook]);


    // If note not found, return 404
    //
    if (!isLoading && !note) {
        return notFound();
    }


    return !isLoading ? (
        <>
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
            />

            <div className="py-28">

                {/* Notices on Archived and Trashed notes */}
                <NoticeTrashAutodeletion note={note} />
                <NoticeCannotEdit note={note} />


                {/* Editor Fields */}
                <div className="mb-1">
                    <TextareaAutosize
                        id="title"
                        placeholder="Title"
                        defaultValue={note?.title}
                        onChange={(e) => { formData.current.title = e.target.value; setHasTextChanged(noteChanged() ? true : false); }}
                        className="w-full bg-transparent outline-none text-3xl sm:text-4xl font-semibold resize-none overflow-auto disabled:cursor-not-allowed dark:placeholder:text-neutral-600"
                        disabled={note?.status !== NoteStatus.published}
                    />
                </div>

                <div className="mb-10">
                    <TextareaAutosize
                        id="subtitle"
                        placeholder="Subtitle"
                        defaultValue={note?.subtitle}
                        onChange={(e) => { formData.current.subtitle = e.target.value; setHasTextChanged(noteChanged() ? true : false); }}
                        className="w-full bg-transparent outline-none text-xl sm:text-2xl font-medium resize-none overflow-auto text-neutral-500 disabled:cursor-not-allowed dark:placeholder:text-neutral-600"
                        disabled={note?.status !== NoteStatus.published}
                    />
                </div>

                <TextEditor
                    note={note}
                    onUpdateFormBody={(newBody: string) => { formData.current.body = newBody; setHasTextChanged(noteChanged() ? true : false) }}
                    noteStatus={status}
                    setCharacterCount={setCharacterCount}
                    setWordCount={setWordCount}
                />

                <CodeEditor
                    note={note}
                    onUpdateFormBody={(newBody: string) => { formData.current.body = newBody; setHasTextChanged(noteChanged() ? true : false) }}
                    onUpdateFormLanguage={(newLanguage: string) => { formData.current.snippet_language = newLanguage; setHasTextChanged(noteChanged() ? true : false) }}
                />

                <TodoEditor
                    note={note}
                />

            </div>

        </>

    ) : <LoadingComponent />
}

export default NotePage;