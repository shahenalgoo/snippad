'use client';

// React
import { FC } from 'react';

// Typings
import { Note } from '@/types/typings';
import { NoteStatus, NoteType } from '@/types/enums';

// Tip Tap
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import BubbleMenu from './BubbleMenu';
import FloatingMenu from './FloatingMenu';



interface TextEditorProps {
    note: Note | null;
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
                class: "min-h-[200px] text-xl leading-8 border-none outline-none disabled:cursor-not-allowed"
            }
        },
        onCreate: ({ editor }) => {
            // Check if note exist
            if (!note) return;

            // Load note content into editor
            editor.commands.setContent(note?.body);

            // If note is not published, setEditable to false
            if (note?.status !== NoteStatus.published) editor?.setEditable(false);
        },
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            onUpdateFormBody(html);
        }
    });


    return note?.type === NoteType.note ? (
        <div className='relative'>
            {noteStatus === NoteStatus.published &&
                <div>
                    <EditorContent editor={editor} />
                </div>
            }

            <BubbleMenu editor={editor} />
            <FloatingMenu editor={editor} />
        </div>
    ) : null
}

export default TextEditor