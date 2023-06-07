import { Dispatch, FC, SetStateAction, useState } from "react";
import { Note } from "@/types/typings";

import { useUser } from "@/context/SessionContext";
import { useDocumentUpdate } from "@/hooks";

import { Button } from "@/components";

import { AppwriteIds } from "@/lib/appwrite-config";
import { Permission, Role } from "appwrite";

import { TbLoader2, TbStar, TbStarFilled } from "react-icons/tb";


interface StarNoteProps {
    note: Note | null
    isSaving: boolean
    isStarred: boolean;
    setStarred: Dispatch<SetStateAction<boolean>>;
}

const StarNote: FC<StarNoteProps> = ({
    note,
    isSaving,
    isStarred,
    setStarred
}) => {

    // States
    //
    const [isLoadingStarred, setIsLoadingStarred] = useState<boolean>(false);


    // Hooks
    //
    const { user } = useUser();
    const { updateDocument } = useDocumentUpdate(AppwriteIds.collectionId_notes);


    // Mark a Note as Starred
    //
    const starNote = () => {
        setIsLoadingStarred(true);

        if (user && note) {
            updateDocument({
                document_id: note.$id,
                data: {
                    starred: !isStarred,
                } as Note,
                permission: [
                    Permission.read(Role.user(user.$id)),
                    Permission.update(Role.user(user.$id)),
                    Permission.delete(Role.user(user.$id)),
                ],
                onSuccess() {
                    setStarred((prev) => !prev);
                    setIsLoadingStarred(false);
                },
                onError() {
                    setIsLoadingStarred(false);
                }
            });
        }
    };


    return (
        <Button variant='bubble' type="button" onClick={starNote} disabled={isSaving}>
            {!isLoadingStarred && !isStarred && <TbStar size={20} strokeWidth={1} />}
            {!isLoadingStarred && isStarred && <TbStarFilled size={20} strokeWidth={1} className="text-star" />}
            {isLoadingStarred && <TbLoader2 size={20} className="opacity-40 animate-spin" />}
        </Button>
    );
}

export default StarNote;