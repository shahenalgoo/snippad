'use client'

import { useCallback, useEffect, useState } from "react";
import { notFound } from "next/navigation";

import { AppwriteIds, databases } from "@/lib/appwrite-config";
import { Note } from "@/types/typings";
import { Button, InputField } from "@/components";
import { toast } from "react-hot-toast";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

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
    const onFieldChange = (e: any) => {
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
                id: "body",
                name: "body"
                // class: "bg-neutral-900 w-[500px] min-h-[300px] text-lg"
            }
        },
        content: `Write here...`,
        onCreate: async ({ editor }) => {
            const data = await fetchNote(id);
            editor.commands.setContent(`${data?.body}`)
        },
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            console.log(html);

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
            <div className="w-[500px] mx-auto text-lg">
                <form onSubmit={onSubmit}>

                    {!isLoading &&
                        <>
                            <input
                                id="title"
                                type="text"
                                defaultValue={note?.title}
                                onChange={onFieldChange}
                                className=" bg-transparent outline-none mt-10 mb-4 text-4xl font-semibold"
                            />

                            <EditorContent
                                editor={editor}

                            />

                            <InputField id="body" defaultValue={note?.body} onChange={onFieldChange} />
                        </>
                    }






                    {/* <input
                        id="subtitle"
                        type="text"
                        defaultValue={note?.subtitle}
                        onChange={onFieldChange}
                        className=""
                    />

                    <textarea
                        id="body"
                        defaultValue={note?.body}
                        onChange={onFieldChange}
                        className="block w-full min-h-[200px] bg-transparent outline-none resize-none"
                    ></textarea> */}

                    <Button disabled={isSaving}>
                        Save Note
                    </Button>
                </form>
            </div>
        </>
    )
}

export default NotePage;