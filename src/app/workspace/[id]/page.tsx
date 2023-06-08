'use client';

// React
import { useCallback, useEffect, useRef, useState } from "react";
import { notFound } from "next/navigation";

// Typings
import { Note, NoteFormData } from "@/types/typings";
import { NoteStatus, NoteType } from "@/types/enums";

// Database
import { AppwriteIds, databases } from "@/lib/appwrite-config";

// Note header
import HeaderNotes from "../(headers)/HeaderNotes";

// Text Editor
import TextareaAutosize from 'react-textarea-autosize';

// Utils
import LoadingComponent from "@/components/misc/Loading";
import { toast } from "react-hot-toast";
import SnippetEditor from "../(code-editor)/SnippetEditor";

import { Notification } from "@/components";

import TextEditor from "../(tip-tap)/TextEditor";
import DeleteTrash from "./DeleteTrash";
import { resourceUsage } from "process";
import { useNotebook } from "@/context/NotebookContext";
import { log } from "console";
import { useDocumentUpdate } from "@/hooks";


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

    const beforeSave = useRef<NoteFormData>({
        title: '',
        subtitle: '',
        body: '',
        snippet_language: ''
    })

    const formData = useRef<NoteFormData>({
        title: '',
        subtitle: '',
        body: '',
        snippet_language: ''
    })

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
                snippet_language: res.snippet_language
            }

            beforeSave.current = {
                title: res.title,
                subtitle: res.subtitle,
                body: res.body,
                snippet_language: res.snippet_language
            }

            return res;
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }

    }, []);

    // Save Note
    async function saveNote(manualSave?: boolean) {
        if (isSaving) return;

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
                //updating before save data
                beforeSave.current.title = formData.current.title;
                beforeSave.current.subtitle = formData.current.subtitle;
                beforeSave.current.body = formData.current.body;
                beforeSave.current.snippet_language = formData.current.snippet_language;

                if (manualSave) toast.success("Note saved!");
                setIsSaving(false);
            },
            onError() {
                toast.error("Unable to save note");
                setIsSaving(false);
            }
        });
    }


    //Check if any changes occured in the text
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


    // Form submit
    //
    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        saveNote();
    }

    // Keyboard Events
    //
    let keyPress = false;
    const handleKeyDown = useCallback((e: any) => {
        // Save Note - Ctrl + s
        if ((e.ctrlKey && e.key === "S" || e.ctrlKey && e.key === "s")) {
            e.preventDefault();
            // onSubmit(e);
            keyPress = true;
            saveNote();
        }

    }, [keyPress]);

    useEffect(() => {

        // Register keydown events
        window.addEventListener("keydown", handleKeyDown);

        return () => {
            // De-register keydown events
            window.removeEventListener("keydown", handleKeyDown);

            console.log("page unmounts");

            saveNote();

        };
    }, [handleKeyDown]);


    useEffect(() => {
        // useCtrlS();
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

            {!isLoading && note?.status === NoteStatus.trashed &&
                <DeleteTrash note={note} />
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


                    <div className="lg:pt-24 lg:pb-24">

                        {/* <input type="file" id="uploader" onChange={() => addImage()} /> */}

                        {/* Visible only when a note is archived or trashed */}
                        {note?.status !== NoteStatus.published &&
                            <Notification variant='danger' className="mb-4">
                                Cannot be edited while archived or trashed.
                            </Notification>
                        }

                        <div className="mb-1">
                            <TextareaAutosize
                                id="title"
                                placeholder="Title"
                                defaultValue={note?.title}
                                onChange={(e) => formData.current.title = e.target.value}
                                className="w-full bg-transparent outline-none text-4xl font-semibold resize-none overflow-auto disabled:cursor-not-allowed"
                                disabled={note?.status !== NoteStatus.published}
                            />
                        </div>

                        <div className="mb-10">
                            <TextareaAutosize
                                id="subtitle"
                                placeholder="Subtitle"
                                defaultValue={note?.subtitle}
                                onChange={(e) => formData.current.subtitle = e.target.value}

                                className="w-full bg-transparent outline-none text-2xl font-medium resize-none overflow-auto text-neutral-500 disabled:cursor-not-allowed"
                                disabled={note?.status !== NoteStatus.published}
                            />
                        </div>

                        <div className="relative">

                            {note?.type === NoteType.note &&
                                <TextEditor
                                    id={id}
                                    note={note}
                                    formData={formData}
                                />
                            }

                            {note?.type === NoteType.code &&
                                <SnippetEditor
                                    note={note}
                                    formData={formData}
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