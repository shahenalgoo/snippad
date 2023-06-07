'use client';

// React
import { useCallback, useEffect, useState } from "react";
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

    const [formData, setFormData] = useState<NoteFormData>({
        title: '',
        subtitle: '',
        body: '',
        snippet_language: ''
    })

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

            setFormData({
                title: res.title,
                subtitle: res.subtitle,
                body: res.body
            });

            return res;
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }

    }, []);


    // Handle state changes on form
    //
    const onFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    }


    // Form submit
    //
    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSaving(true);

        // Disable save if note is empty
        if (formData.body === "") {
            setIsSaving(false);
            return toast.error('Please write a note first.');
        }

        try {

            await databases.updateDocument(AppwriteIds.databaseId, AppwriteIds.collectionId_notes, id, {
                title: formData?.title,
                subtitle: formData?.subtitle,
                body: formData?.body,
                snippet_language: formData.snippet_language,
                search_index: formData?.title + ' ' + formData?.subtitle + ' ' + formData?.body
            } as Note);

            toast.success("Note saved!");

        } catch (error) {
            console.log(error);
            toast.error("Unable to save note");
        } finally {
            setIsSaving(false);
        }
    }


    useEffect(() => {
        fetchNote(id);
    }, [fetchNote, id]);


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
                                onChange={onFieldChange}
                                className="w-full bg-transparent outline-none text-4xl font-semibold resize-none overflow-auto disabled:cursor-not-allowed"
                                disabled={note?.status !== NoteStatus.published}
                            />
                        </div>

                        <div className="mb-10">
                            <TextareaAutosize
                                id="subtitle"
                                placeholder="Subtitle"
                                defaultValue={note?.subtitle}
                                onChange={onFieldChange}
                                className="w-full bg-transparent outline-none text-2xl font-medium resize-none overflow-auto text-slate-500 disabled:cursor-not-allowed"
                                disabled={note?.status !== NoteStatus.published}
                            />
                        </div>

                        <div className="relative">

                            {note?.type === NoteType.note &&
                                <TextEditor
                                    id={id}
                                    note={note}
                                    formData={formData}
                                    setFormData={setFormData}
                                />
                            }

                            {note?.type === NoteType.code &&
                                <SnippetEditor
                                    note={note}
                                    formData={formData}
                                    setFormData={setFormData}
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