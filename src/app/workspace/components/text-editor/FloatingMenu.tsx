import { FC } from "react";

import { FloatingMenu as Floater, Editor } from '@tiptap/react';
import { Button } from "@/components";
import { TbPhoto, TbPhotoUp } from "react-icons/tb";
import ImageUploader from "./ImageUploader";
import { useToggle } from "@/hooks";



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
                <>


                    <Floater className="flex gap-1 z-[!888]" tippyOptions={{ duration: 100 }} editor={editor}>
                        <Button type="button" variant='black' size='square'
                            onClick={() => {
                                editor.unregisterPlugin("FloatingMenu");

                                setUploaderActive(true)
                            }}
                        >
                            <TbPhoto size={20} />
                        </Button>



                        {/* <Button variant='black' size='square'
                        onClick={() => editor.chain().focus().setImage({ src: "https://cloud.appwrite.io/v1/storage/buckets/647efcd5445f6f3463af/files/64844040490f5c537113/preview?project=64687e7940bb4dcc5d61" }).run()}
                    >
                        <TbPhoto size={20} />
                    </Button> */}
                    </Floater>
                </>
            }

        </>
    );
}

export default FloatingMenu;