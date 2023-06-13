// React
import { FC } from "react";

// Hooks
import { useToggle } from "@/hooks";

// Components
import { Button } from "@/components";

// Editor
import { FloatingMenu as Floater, Editor } from '@tiptap/react';

// Icons
import { TbPhoto } from "react-icons/tb";

// Image Uploader
import ImageUploader from "./ImageUploader";



/**
 * EXPORTED PARENT COMPONENT
 */
interface FloatingMenuProps {
    editor: Editor | null;
}

const FloatingMenu: FC<FloatingMenuProps> = ({ editor }) => {

    const [uploaderActive, setUploaderActive] = useToggle();

    return (
        <>
            {/* Image uploader modal */}
            <ImageUploader
                uploaderActive={uploaderActive}
                setUploaderActive={setUploaderActive}
                editor={editor}
            />


            {/* Floating Menu */}
            {editor &&
                <Floater className="flex gap-1 z-[!888]" tippyOptions={{ duration: 100 }} editor={editor}>
                    <Button type="button" variant='black' size='square'
                        onClick={() => {
                            editor.unregisterPlugin("FloatingMenu");

                            setUploaderActive(true)
                        }}
                    >
                        <TbPhoto size={20} />
                    </Button>
                </Floater>
            }

        </>
    );
}

export default FloatingMenu;