'use client';

// React
import { Dispatch, FC, MutableRefObject, SetStateAction } from 'react';

// Typings
import { Note, NoteFormData } from '@/types/typings';
import { NoteStatus } from '@/types/enums';

// Tip Tap
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import BubbleMenu from './BubbleMenu';


interface TextEditorProps {
    id: string;
    note: Note;
    formData: MutableRefObject<NoteFormData>;
}


const TextEditor: FC<TextEditorProps> = ({ id, note, formData }) => {

    // Text Editor
    //
    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder: 'Write your note...'
            }),
            Image,
            // Dropcursor
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
            formData.current.body = html;
        }
    });


    return (
        <>
            <div>
                <EditorContent editor={editor} />
            </div>

            <BubbleMenu editor={editor} />
        </>
    )
}

export default TextEditor