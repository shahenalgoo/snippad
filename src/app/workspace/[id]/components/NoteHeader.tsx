import { Button } from "@/components";
import { FC } from "react";

interface NoteHeaderProps {
    editor: any;
    isSaving: boolean
}

const NoteHeader: FC<NoteHeaderProps> = ({ editor, isSaving }) => {
    return (
        <nav className="h-16 flex items-center">

            <button type="button"
                onClick={() => editor?.chain().focus().toggleBold().run()}
                disabled={
                    !editor?.can()
                        .chain()
                        .focus()
                        .toggleBold()
                        .run()
                }
                className={editor?.isActive('bold') ? 'is-active' : ''}
            >
                bold
            </button>


            <Button type="submit" disabled={isSaving}>
                Save Note
            </Button>
        </nav>
    );
}

export default NoteHeader;