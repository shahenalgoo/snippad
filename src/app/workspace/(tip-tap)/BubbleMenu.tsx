import { FC, ReactNode } from "react";
import { BubbleMenu as Bubble, Editor } from '@tiptap/react';
import { TbBold, TbItalic, TbStrikethrough, TbH1, TbH2, TbH3, TbList, TbListNumbers, TbQuote, TbCode } from "react-icons/tb";
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
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    className={editor.isActive('heading', { level: 1 }) ? style.active : style.inactive}
                >
                    <TbH1 />
                </BubbleButton>

                <BubbleButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={editor.isActive('heading', { level: 2 }) ? style.active : style.inactive}
                >
                    <TbH2 />
                </BubbleButton>

                <BubbleButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    className={editor.isActive('heading', { level: 3 }) ? style.active : style.inactive}
                >
                    <TbH3 />
                </BubbleButton>

                <BubbleSep />

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
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={editor.isActive('bulletList') ? style.active : style.inactive}
                >
                    <TbList />
                </BubbleButton>

                <BubbleButton
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={editor.isActive('orderedList') ? style.active : style.inactive}
                >
                    <TbListNumbers />
                </BubbleButton>

                {/* <BubbleSep />

                <BubbleButton
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    className={editor.isActive('blockquote') ? style.active : style.inactive}
                >
                    <TbQuote />
                </BubbleButton>

                <BubbleButton
                    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                    className={editor.isActive('codeBlock') ? style.active : style.inactive}
                >
                    <TbCode />
                </BubbleButton> */}



            </Bubble>}
        </div>
    );
}

export default BubbleMenu;



interface BubbleButtonProps {
    onClick: any;
    className: string;
    children: ReactNode;
}


const BubbleButton: FC<BubbleButtonProps> = ({ onClick, className, children }) => {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`w-8 h-10 flex justify-center items-center rounded-lg text-2xl mr-1 last:mr-0 transition-all ${className}`}
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