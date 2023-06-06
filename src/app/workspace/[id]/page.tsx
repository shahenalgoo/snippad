'use client';

// React
import { useCallback, useEffect, useState } from "react";
import { notFound } from "next/navigation";

// Typings
import { Note, NoteFormData } from "@/types/typings";
import { NoteStatus, NoteType } from "@/types/enums";

// Database
import { AppwriteIds, databases, storage } from "@/lib/appwrite-config";

// Note header
import NoteHeader from "../(header-note)/NoteHeader";

// Text Editor
import { useEditor, EditorContent, FloatingMenu, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from "@tiptap/extension-placeholder";
import BubbleMenu from "../(text-editor)/BubbleMenu";
import TextareaAutosize from 'react-textarea-autosize';

// Utils
import LoadingComponent from "@/components/misc/Loading";
import { toast } from "react-hot-toast";
import SnippetEditor from "../(code-editor)/SnippetEditor";
import Image from "@tiptap/extension-image";
import { ID } from "appwrite";
import Dropcursor from "@tiptap/extension-dropcursor";


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




    // Text Editor
    //
    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder: 'Write your note...'
            }),
            Image,
            Dropcursor
        ],
        editorProps: {
            attributes: {
                class: "min-h-[200px] bg-white text-black text-xl leading-8 border-none outline-none"
            }
        },
        autofocus: true,
        onCreate: async ({ editor }) => {
            const data = await fetchNote(id);
            editor.commands.setContent(`${data?.body}` || null);

        },
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            setFormData({ ...formData, body: html })
        }
    });

    // Add Image
    //
    const addImage = async () => {
        //console.log("trying to add image");

        const element: HTMLInputElement = document.getElementById('uploader') as HTMLInputElement;
        if (!element.files) {
            console.log("no file found");
            return;
        }
        const response = await storage.createFile(
            AppwriteIds.bucketId_images,
            ID.unique(),
            element.files[0]
        );


        const url = storage.getFilePreview(AppwriteIds.bucketId_images, response.$id);

        if (url) {
            editor?.chain().focus().setImage({ src: url.href }).run()
        }

        //console.log("image added");

    }


    // Save Note
    //
    const onSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
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
    }, [formData, id])


    // Keyboard Events
    //
    const handleKeyDown = useCallback((e: any) => {

        // Save Note - Ctrl + s
        if ((e.ctrlKey && e.key === "S" || e.ctrlKey && e.key === "s")) {
            e.preventDefault();
            onSubmit(e);
        }

    }, [onSubmit]);

    useEffect(() => {

        // Register keydown events
        window.addEventListener("keydown", handleKeyDown);

        return () => {
            // De-register keydown events
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [handleKeyDown]);


    // If note note found, return not-found page
    //
    if (!isLoading && !note) {
        return notFound();
    }

    // if (!isLoading && note?.type === NoteType.code) {
    //     return (
    //         <>
    //             <CodeEditor />
    //         </>
    //     )
    // }

    return (
        <>
            {isLoading &&
                <LoadingComponent />
            }

            {!isLoading &&
                <form onSubmit={onSubmit} className="font-body">

                    <NoteHeader
                        editor={editor}
                        note={note}
                        isSaving={isSaving}
                        isStarred={starred}
                        setStarred={setStarred}
                        status={status}
                        setStatus={setStatus}
                    />

                    <input type="file" id="uploader" onChange={() => addImage()} />

                    <BubbleMenu editor={editor} />

                    <div className="lg:pt-24 lg:pb-24">

                        <div className="mb-1">
                            <TextareaAutosize
                                id="title"
                                placeholder="Title"
                                defaultValue={note?.title}
                                onChange={onFieldChange}
                                className="w-full bg-transparent outline-none text-4xl font-semibold resize-none overflow-auto"
                            />
                        </div>

                        <div className="mb-10">
                            <TextareaAutosize
                                id="subtitle"
                                placeholder="Subtitle"
                                defaultValue={note?.subtitle}
                                onChange={onFieldChange}
                                className="w-full bg-transparent outline-none text-2xl font-medium resize-none overflow-auto text-slate-500"
                            />
                        </div>

                        <div className="relative">
                            {note?.type === NoteType.note && <EditorContent editor={editor} />}

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