// React
import { FC, useEffect, useState } from "react";

// Typings
import { Note, SnippetLanguage } from "@/types/typings";
import { NoteStatus, NoteType } from "@/types/enums";

// CodeMirror
import CodeMirror from '@uiw/react-codemirror';
import { langNames, LanguageName, loadLanguage } from '@uiw/codemirror-extensions-langs';

import { vscodeDark } from "@uiw/codemirror-theme-vscode";

// Data
import { languages } from "@/data/languages";

// Icons
import { TbArrowsMaximize, TbArrowsMinimize, TbChevronDown } from "react-icons/tb";
import { useToggle } from "@/hooks";
import { Button } from "@/components";


interface CodeEditorProps {
    note: Note | null;
    onUpdateFormBody: (newBody: string) => void;
    onUpdateFormLanguage: (newLanguage: string) => void;
}


const CodeEditor: FC<CodeEditorProps> = ({
    note,
    onUpdateFormBody,
    onUpdateFormLanguage
}) => {

    // States
    //
    const [language, setLanguage] = useState<LanguageName>('javascript');
    const [fullscreen, setFullscreen] = useToggle();


    //Handle language changes
    //
    const onLanguageChange = (e: any) => {
        onUpdateFormLanguage(e.target.value);
        setLanguage(e.target.value)
    }


    // Use effect
    //
    useEffect(() => {
        setLanguage(note?.snippet_language as LanguageName);
    }, [note]);


    return note?.type === NoteType.code ? (
        <div className="relative">

            {/* Language Selector */}
            <div className="relative">
                <select
                    defaultValue={note?.snippet_language}
                    onChange={onLanguageChange}
                    className="capitalize block w-full mb-4 p-3 bg-neutral-50 dark:bg-neutral-800 border border-border-light dark:border-neutral-800 focus:border-neutral-500 text-gray-900 dark:text-white font-sans rounded-lg outline-none appearance-none disabled:cursor-not-allowed"
                    disabled={note?.status !== NoteStatus.published}
                >
                    {languages.map((language: SnippetLanguage, i) => (
                        <option key={i} value={language.alias}>{language.name}</option>
                    ))}
                </select>
                <TbChevronDown size={18} className=" absolute top-0 right-0 m-[14px]" />
            </div>

            {/* Code Editor */}
            <div className={` bg-[#1E1E1E] py-2 ${!fullscreen ? 'relative mt-4 rounded-lg' : 'fixed z-[8888] top-0 left-0 w-full h-full'}`}>

                <Button onClick={() => setFullscreen(!fullscreen)} variant='black' size='square' className="absolute top-2 right-2 z-40">
                    {!fullscreen && <TbArrowsMaximize />}
                    {fullscreen && <TbArrowsMinimize />}
                </Button>

                <CodeMirror
                    value={note?.body}
                    onChange={(value: any) => onUpdateFormBody(value)}
                    extensions={[loadLanguage(language)!].filter(Boolean)}
                    placeholder={`Write your ${language.toUpperCase()} code...`}
                    autoFocus={note?.status === NoteStatus.published}
                    editable={note?.status === NoteStatus.published}
                    readOnly={note?.status !== NoteStatus.published}
                    minHeight="500px"
                    theme={vscodeDark}
                />
            </div>
        </div>
    ) : null
}

export default CodeEditor;