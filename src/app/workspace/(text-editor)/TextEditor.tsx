'use client';

// React
import { FC } from 'react';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from "@tiptap/extension-placeholder";

interface TextEditorProps {
    id: string;
    fetchNote: any;
    formData: any;
    setFormData: any;
}

const TextEditor: FC<TextEditorProps> = ({ id, fetchNote, formData, setFormData }) => {


    return (
        <div>

        </div>
    )
}

export default TextEditor