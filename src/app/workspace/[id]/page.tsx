'use client';

import { useCallback, useEffect, useState } from "react";
import { notFound } from "next/navigation";

import { AppwriteIds, databases } from "@/lib/appwrite-config";
import { Note } from "@/types/typings";
import { Button, InputField, InputLabel } from "@/components";
import { toast } from "react-hot-toast";
import TextareaAutosize from 'react-textarea-autosize';

import { useEditor, EditorContent, FloatingMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextStyle from "@tiptap/extension-text-style";

import LoadingComponent from "@/components/misc/Loading";
import NoteHeader from "./components/NoteHeader";
import BubbleMenu from "./components/BubbleMenu";

type PageProps = {
    params: {
        id: string;
    }
}

type FormData = {
    title: string,
    subtitle: string,
    body: string,
    type: string
}

const NotePage = ({ params: { id } }: PageProps) => {

    // States
    //
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [note, setNote] = useState<Note | null>(null);
    const [formData, setFormData] = useState<FormData>({
        title: '',
        subtitle: '',
        body: '',
        type: 'note'
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
            setFormData({
                title: res.title,
                subtitle: res.subtitle,
                body: res.body,
                type: res.type
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
        ],
        editorProps: {
            attributes: {
                class: "min-h-[200px] bg-white text-black text-xl leading-8 border-none outline-none"
            }
        },
        content: `Write here...`,
        onCreate: async ({ editor }) => {
            const data = await fetchNote(id);
            editor.commands.setContent(`${data?.body}`);
        },
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            setFormData({ ...formData, body: html })
        }
    });


    // Save Note
    //
    const onSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            await databases.updateDocument(AppwriteIds.databaseId, AppwriteIds.collectionId_notes, id, {
                title: formData?.title,
                subtitle: formData?.subtitle,
                body: formData?.body
            });
            toast.success("Note saved!")
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


    return (
        <>
            {isLoading &&
                <LoadingComponent loadingMessage="Loading note..." />
            }

            {!isLoading &&
                <form onSubmit={onSubmit} className="font-body">

                    <NoteHeader editor={editor} isSaving={isSaving} note={note} />

                    <BubbleMenu editor={editor} />

                    <div className="lg:pt-24">
                        <div className="mb-1">
                            <InputLabel variant='lighter'>Note Title</InputLabel>
                            <TextareaAutosize
                                id="title"
                                defaultValue={note?.title}
                                onChange={onFieldChange}
                                className="w-full bg-transparent outline-none text-4xl font-semibold resize-none overflow-auto"
                            />
                        </div>

                        <div className="mb-10">
                            <InputLabel variant='lighter'>Subtitle</InputLabel>
                            <TextareaAutosize
                                id="subtitle"
                                defaultValue={note?.subtitle}
                                onChange={onFieldChange}
                                className="w-full bg-transparent outline-none text-2xl font-medium resize-none overflow-auto text-slate-500"
                            />
                        </div>

                        <div>
                            <InputLabel variant='lighter'>Note</InputLabel>
                            <EditorContent editor={editor} autoFocus />
                        </div>
                    </div>

                </form>
            }
        </>
    )
}

export default NotePage;