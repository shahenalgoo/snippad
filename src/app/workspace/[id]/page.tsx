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
        body: ''
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
                body: res.body
            });
            return res;
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }

    }, []);

    // useEffect(() => {
    //     fetchNote(id);
    // }, [fetchNote, id]);


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
                class: "bg-white text-black text-xl leading-8 border-none outline-none"
            }
        },
        content: `Write here...`,
        onCreate: async ({ editor }) => {
            const data = await fetchNote(id);
            editor.commands.setContent(`${data?.body}`)
        },
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            setFormData({ ...formData, body: html })
        }
    });


    // Save Note
    //
    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSaving(true);
        toast.loading("Saving note...");

        try {
            await databases.updateDocument(AppwriteIds.databaseId, AppwriteIds.collectionId_notes, id, {
                title: formData?.title,
                subtitle: formData?.subtitle,
                body: formData?.body
            });
            toast.dismiss();
            toast.success("Note saved!")
        } catch (error) {
            console.log(error);
            toast.dismiss();
            toast.error("Unable to save note");
        } finally {
            setIsSaving(false);
        }
    }


    return (
        <>
            {isLoading &&
                <LoadingComponent loadingMessage="Loading note..." />
            }

            {!isLoading &&
                <form onSubmit={onSubmit} className="font-body">

                    <NoteHeader editor={editor} isSaving={isSaving} />

                    <BubbleMenu editor={editor} />

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
                            className="w-full bg-transparent outline-none text-xl font-medium resize-none overflow-auto text-slate-500"
                        />
                    </div>

                    <div>
                        <EditorContent editor={editor} />
                    </div>

                </form>
            }
        </>
    )
}

export default NotePage;