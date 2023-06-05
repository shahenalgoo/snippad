'use client';

// React
import { Dispatch, FC, SetStateAction, useState, useEffect } from "react";

// Typings
import { Note, NoteFormData } from "@/types/typings";

// Monaco
import Editor, { DiffEditor, useMonaco, loader } from '@monaco-editor/react';
import { languages, files } from "./languages";

interface CodeEditorProps {
    note: Note | null;
    formData: NoteFormData,
    setFormData: Dispatch<SetStateAction<NoteFormData>>;

}

const CodeEditor: FC<CodeEditorProps> = ({ note, formData, setFormData }) => {

    // const [fileName, setFileName] = useState('script.js');

    //@ts-ignore
    // const file = files[fileName];


    // Handle onchange event on editor
    //
    function handleEditorChange(value: any) {
        setFormData({ ...formData, body: value });
    }


    return (
        <div>

            {/* <button disabled={fileName === 'script.js'} onClick={() => setFileName('script.js')}>
                script.js
            </button>
            <button disabled={fileName === 'style.css'} onClick={() => setFileName('style.css')}>
                style.css
            </button>
            <button disabled={fileName === 'index.html'} onClick={() => setFileName('index.html')}>
                index.html
            </button> */}

            <Editor
                height="100vh"
                defaultLanguage="javascript"
                defaultValue={note?.body}
                onChange={handleEditorChange}
                className="text-2xl"
                theme="vs-dark"
            />
        </div>
    );
}

export default CodeEditor;