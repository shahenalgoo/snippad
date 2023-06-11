'use client';

// React
import { FC } from 'react';

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
import FloatingMenu from './FloatingMenu';



interface TextEditorProps {
    note: Note;
    onUpdateFormBody: (newBody: string) => void;
    noteStatus: NoteStatus | null;
}


const TextEditor: FC<TextEditorProps> = ({ note, onUpdateFormBody, noteStatus }) => {

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


    return (
        <>
            {noteStatus === NoteStatus.published &&
                <div>
                    <EditorContent editor={editor} />
                </div>
            }

            <BubbleMenu editor={editor} />
            <FloatingMenu editor={editor} />
        </>
    )
}

export default TextEditor