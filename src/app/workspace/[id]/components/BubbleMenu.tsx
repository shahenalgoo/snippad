import { FC } from "react";
import { BubbleMenu as Bubble, Editor } from '@tiptap/react';
import { TbBold, TbItalic, TbStrikethrough, TbH1 } from "react-icons/tb";
import { Button } from "@/components";

interface BubbleMenuProps {
    editor: Editor | null;
}

const BubbleMenu: FC<BubbleMenuProps> = ({ editor }) => {

    const style = {
        inactive: "text-neutral-400",
        active: "text-white"
    }

    return (
        <div>
            {editor && <Bubble className="flex items-center px-2 rounded-full bg-black" tippyOptions={{ duration: 100 }} editor={editor}>

                <BubbleButton
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={editor.isActive('bold') ? style.active : style.inactive}
                >
                    <TbBold />
                </BubbleButton>

                <BubbleButton
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={editor.isActive('italic') ? style.active : style.inactive}
                >
                    <TbItalic />
                </BubbleButton>

                <BubbleButton
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    className={editor.isActive('strike') ? style.active : style.inactive}
                >
                    <TbStrikethrough />
                </BubbleButton>

                <BubbleSep />

                <BubbleButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    className={editor.isActive('heading', { level: 1 }) ? style.active : style.inactive}
                >
                    <TbH1 />
                </BubbleButton>

            </Bubble>}
        </div>
    );
}

export default BubbleMenu;

interface BubbleButtonProps {
    onClick: any;
    className: string;
    children: any;
}


const BubbleButton: FC<BubbleButtonProps> = ({ onClick, className, children }) => {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`w-8 h-10 flex justify-center items-center rounded-lg text-2xl mr-1 last:mr-0 transition-all border border-transparent ${className}`}
        >
            {children}
        </button>
    )
}


const BubbleSep = () => {
    return (
        <div className="w-[1px] h-4 mx-3 bg-neutral-600">
            &nbsp;
        </div>
    )
}