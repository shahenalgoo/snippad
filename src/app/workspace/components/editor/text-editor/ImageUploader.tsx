// React
import { FC } from "react";

// Hooks
import { useUser } from "@/context/SessionContext";

// Components
import { Button, Modal } from "@/components";

// Appwrite
import { AppwriteIds, storage } from "@/lib/appwrite-config";
import { ID, Permission, Role } from "appwrite";

// Editor
import { Editor, NodeViewWrapper } from '@tiptap/react'

// Misc
import toast from "react-hot-toast";


interface ImageUploaderProps {
    uploaderActive: boolean;
    setUploaderActive: any;
    editor: Editor | null;
}

const ImageUploader: FC<ImageUploaderProps> = ({ uploaderActive, setUploaderActive, editor }) => {

    // Hooks
    const { user } = useUser();


    // Add Image
    //
    const onAddImage = async () => {

        // Check user so we can add permissions
        if (!user) {
            toast.error("You don't have permission to upload");
            return;
        }

        // Get reference to upload image element
        const element: HTMLInputElement = document.getElementById('uploader') as HTMLInputElement;

        // Check if files are found
        if (!element.files) {
            toast.error("Image file cannot be found");
            return;
        }

        // Check if there is at least 1 file
        if (element.files.length == 0) {
            toast.error("Please upload an image first");
            return;
        }

        try {

            toast.loading("Uploading image");

            // Save in Appwrite Bucket DB
            const response = await storage.createFile(
                AppwriteIds.bucketId_images,
                ID.unique(),
                element.files[0],
                [
                    Permission.read(Role.user(user.$id)),
                    Permission.update(Role.user(user.$id)),
                    Permission.delete(Role.user(user.$id)),
                ]
            );

            // Upload success
            toast.dismiss();
            toast.success("Image added");

            // Get URL back from Bucket
            const url = storage.getFilePreview(AppwriteIds.bucketId_images, response.$id);

            // Add to Text Editor
            if (url) {
                editor?.chain().focus().setImage({ src: url.href }).run()
                editor?.chain().focus().enter();
            }

            // Clear Image upload
            element.value = "";

        } catch (error) {
            console.log(error);
        } finally {
            // Close modal
            setUploaderActive(!uploaderActive);
        }
    }

    return (
        <>
            <NodeViewWrapper className="react-component-with-content">
                <Modal
                    title="Upload Image"
                    modalActive={uploaderActive}
                    onClose={() => setUploaderActive(!uploaderActive)}
                    className="font-sans"
                >

                    <div className="p-4">
                        <input id="uploader" type="file" accept="image/png, image/jpeg" className="block w-full py-2 px-2 text-sm text-neutral-900 dark:text-neutral-300 bg-gray-50 dark:bg-neutral-800 border border-gray-300 dark:border-neutral-800 rounded-lg cursor-pointer " />

                        <div className="mt-4 flex justify-end">
                            <Button type="button" onClick={onAddImage}>Upload Image</Button>
                        </div>
                    </div>

                </Modal>
            </NodeViewWrapper>

        </>
    );
}

export default ImageUploader;