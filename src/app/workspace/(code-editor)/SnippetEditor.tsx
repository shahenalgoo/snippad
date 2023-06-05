'use client';

// React
import { Dispatch, FC, SetStateAction, useState } from "react";
import dynamic from "next/dynamic";

// Typings
import { Note, NoteFormData } from "@/types/typings";

// Code Editor
import "@uiw/react-textarea-code-editor/dist.css";
const CodeEditor = dynamic(
    () => import("@uiw/react-textarea-code-editor").then((mod) => mod.default),
    { ssr: false }
);

interface SnippetEditorProps {
    note: Note | null;
    formData: NoteFormData,
    setFormData: Dispatch<SetStateAction<NoteFormData>>;
}

const SnippetEditor: FC<SnippetEditorProps> = ({ note, formData, setFormData }) => {

    const [language, setLanguage] = useState('js');

    return (
        <>
            <button type="button" onClick={() => setLanguage('html')}>change to html</button>

            <CodeEditor
                value={note?.body}
                language={language}
                placeholder="Please enter JS code."
                onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                padding={32}
                style={{
                    fontSize: 16,
                    backgroundColor: "#171A23",
                    fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
                }}
                className="rounded-xl"
            />
        </>
    );
}

export default SnippetEditor;