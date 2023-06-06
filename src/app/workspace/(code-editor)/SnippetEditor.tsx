// TODO: IMPROVE WITH BETTER CODE EDITOR: https://uiwjs.github.io/react-codemirror/
// Supported languages: https://github.com/wooorm/refractor#syntaxes

'use client';

// React
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Typings
import { Note, NoteFormData, SnippetLanguage } from "@/types/typings";
import { NoteStatus } from "@/types/enums";

// Code Editor
import { languages } from "./languages";
import "@uiw/react-textarea-code-editor/dist.css";
const CodeEditor = dynamic(
    () => import("@uiw/react-textarea-code-editor").then((mod) => mod.default),
    { ssr: false }
);

// Icons
import { TbChevronDown } from "react-icons/tb";


interface SnippetEditorProps {
    note: Note | null;
    formData: NoteFormData,
    setFormData: Dispatch<SetStateAction<NoteFormData>>;
}


const SnippetEditor: FC<SnippetEditorProps> = ({ note, formData, setFormData }) => {

    const [language, setLanguage] = useState('html');

    const handleLanguage = (e: any) => {
        setFormData({ ...formData, snippet_language: e.target.value })
        setLanguage(e.target.value)
    }


    useEffect(() => {
        setLanguage(String(note?.snippet_language));
    }, [note]);


    return (
        <>
            <div className="relative">
                <select
                    id="countries"
                    defaultValue={note?.snippet_language}
                    onChange={handleLanguage}
                    className="block w-full mb-4 p-2.5 bg-slate-200  border border-transparent focus:border-slate-300 text-gray-900 font-sans rounded-lg outline-none appearance-none disabled:cursor-not-allowed"
                    disabled={note?.status !== NoteStatus.published}
                >
                    {languages.map((language: SnippetLanguage, i) => (
                        <option key={i} value={language.alias}>{language.name}</option>
                    ))}
                </select>
                <TbChevronDown size={18} className=" absolute top-0 right-0 m-[14px]" />
            </div>

            <div data-color-mode="dark" className="overflow-hidden rounded-lg">
                <CodeEditor
                    value={note?.body}
                    language={language}
                    onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                    placeholder={`Write your ${language.toUpperCase()} code...`}
                    padding={32}
                    style={{
                        fontSize: 16,
                        backgroundColor: "#0f172a",
                        fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
                    }}
                    disabled={note?.status !== NoteStatus.published}
                />
            </div>
        </>
    );
}

export default SnippetEditor;