'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';


const TextEditor = () => {

    const editor = useEditor({
        extensions: [
            StarterKit,
        ],
        editorProps: {
            attributes: {
                class: "bg-neutral-900 w-[500px] min-h-[300px] text-lg"
            }
        },
        content: '<p>Write here...</p>',
    })

    return (
        <EditorContent editor={editor} />
    )
}

export default TextEditor