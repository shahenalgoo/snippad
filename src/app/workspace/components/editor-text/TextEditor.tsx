'use client';

// React
import { Dispatch, FC, SetStateAction } from 'react';

// Typings
import { Note } from '@/types/typings';
import { NoteStatus, NoteType } from '@/types/enums';

// Tip Tap
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import BubbleMenu from './BubbleMenu';
import FloatingMenu from './FloatingMenu';

import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import CharacterCount from '@tiptap/extension-character-count'



interface TextEditorProps {
    note: Note | null;
    onUpdateFormBody: (newBody: string) => void;
    noteStatus: NoteStatus | null;
    setCharacterCount: Dispatch<SetStateAction<number>>;
    setWordCount: Dispatch<SetStateAction<number>>;
}

const TextEditor: FC<TextEditorProps> = ({ note, onUpdateFormBody, noteStatus, setCharacterCount, setWordCount }) => {

    const characterLimit = 5000;

    // Text Editor
    //
    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder: 'Write your note...'
            }),
            Image.configure({ inline: true }),
            CharacterCount.configure({ limit: characterLimit })
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
            editor.commands.setContent(note.body);

            // If note is not published, setEditable to false
            if (note?.status !== NoteStatus.published) editor?.setEditable(false);

            // Update word count onCreate
            setCharacterCount(editor.storage.characterCount.characters());
            setWordCount(editor.storage.characterCount.words());
        },
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            onUpdateFormBody(html);

            // Update word count onUpdate
            setCharacterCount(editor.storage.characterCount.characters());
            setWordCount(editor.storage.characterCount.words());

        },

    });


    return note?.type === NoteType.note ? (
        <div className='relative'>
            {noteStatus === NoteStatus.published && editor &&
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