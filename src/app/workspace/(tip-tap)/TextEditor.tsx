'use client';

// React
import { Dispatch, FC, useEffect } from 'react';

// Typings
import { Note } from '@/types/typings';
import { NoteStatus } from '@/types/enums';

// Hooks
import { useUser } from '@/context/SessionContext';

// Components
import { Button } from '@/components';

// Utils
import toast from 'react-hot-toast';

// Appwrite
import { AppwriteIds, storage } from '@/lib/appwrite-config';
import { ID, Permission, Role } from 'appwrite';

// Tip Tap
import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import BubbleMenu from './BubbleMenu';



interface TextEditorProps {
    id: string;
    note: Note;
    onUpdateFormBody: (newBody: string) => void;
    noteStatus: NoteStatus | null;
}


const TextEditor: FC<TextEditorProps> = ({ id, note, onUpdateFormBody, noteStatus }) => {

    const { user } = useUser();

    // Text Editor
    //
    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder: 'Write your note...'
            }),
            Image,
        ],
        editorProps: {
            attributes: {
                class: "min-h-[200px] bg-white text-black text-xl leading-8 border-none outline-none disabled:cursor-not-allowed"
            }
        },
        onCreate: ({ editor }) => {

            // Load note content into editor
            editor.commands.setContent(note.body);

            // If note is not published, setEditable to false
            if (note?.status !== NoteStatus.published) editor?.setEditable(false);
        },
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            onUpdateFormBody(html);
        }
    });


    // Add Image
    //
    const onAddImage = async () => {
        // Check user so we can add permissions
        if (!user) {
            toast.error("You don't have permission to upload");
            return;
        }

        // Get reference to upload image element
        const element: HTMLInputElement = document.getElementById('uploader') as HTMLInputElement;

        // Check if files are found
        if (!element.files) {
            toast.error("Image file cannot be found");
            return;
        }

        // Check if there is at least 1 file
        if (element.files.length == 0) {
            toast.error("Please upload an image first");
            return;
        }

        // Save in Appwrite Bucket DB
        const response = await storage.createFile(
            AppwriteIds.bucketId_images,
            ID.unique(),
            element.files[0],
            [
                Permission.read(Role.user(user.$id)),
                Permission.update(Role.user(user.$id)),
                Permission.delete(Role.user(user.$id)),
            ]
        );

        // Get URL back from Bucket
        const url = storage.getFilePreview(AppwriteIds.bucketId_images, response.$id);

        // Add to Text Editor
        if (url) {
            editor?.chain().focus().setImage({ src: url.href }).run()
            editor?.chain().focus().enter();
        }

        // Clear Image upload
        element.value = "";

    }

    return (
        <>
            {noteStatus === NoteStatus.published && <div>
                <input type="file" id='uploader' />
                <Button type="button" onClick={onAddImage}>Upload</Button>
                <EditorContent editor={editor} />

            </div>}

            <BubbleMenu editor={editor} />
        </>
    )
}

export default TextEditor