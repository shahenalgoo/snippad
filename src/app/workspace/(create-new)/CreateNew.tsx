'use client';

// React
import { FC } from "react";
import { useRouter } from 'next/navigation';

// Typings
import { Note } from "@/types/typings";
import { NoteStatus, NoteType } from "@/types/enums";

// Hooks
import { useUser } from "@/context/SessionContext";
import { useNotebook } from "@/context/NotebookContext";
import { useDocumentCreate } from "@/hooks";

// Appwrite
import { AppwriteIds } from "@/lib/appwrite-config";
import { Permission, Role } from "appwrite";

// Icons
import { TbNotes, TbCode } from "react-icons/tb";

interface CreateNewProps {

}

const CreateNew: FC<CreateNewProps> = () => {

    // Init router
    //
    const router = useRouter();

    //Notebook data
    const { activeNotebook } = useNotebook();


    //User data
    const { user, isLoading } = useUser();


    // Create a new note
    //
    const { createDocument } = useDocumentCreate(AppwriteIds.collectionId_notes);

    const createNote = async (type: NoteType) => {

        // If we cannot find the relating notebook, cancel create.
        if (activeNotebook === null) {
            return;
        }

        try {
            const res = await createDocument({
                data: {
                    title: "",
                    subtitle: "",
                    body: "",
                    notebook_related: activeNotebook.$id,
                    type: type,
                    starred: false,
                    status: NoteStatus.published,
                    snippet_language: 'html',
                    search_index: ''
                } as Note,
                permission: [
                    Permission.read(Role.user(user?.$id || "")),
                    Permission.update(Role.user(user?.$id || "")),
                    Permission.delete(Role.user(user?.$id || "")),
                ]
            });

            if (res) {
                router.push(`/workspace/${res?.$id}`);
            }

        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <div className="w-full h-full flex flex-col justify-center items-center">

                <h1 className="mb-8 text-xl text-slate-400">Create New</h1>

                <div className="flex gap-6">
                    <CreateNewButton className="bg-emerald-100" onClick={() => createNote(NoteType.note)}>
                        <TbNotes size={30} strokeWidth={1} />
                        Note
                    </CreateNewButton>

                    <CreateNewButton className="bg-blue-100" onClick={() => createNote(NoteType.code)}>
                        <TbCode size={30} strokeWidth={1} />
                        Code
                    </CreateNewButton>
                </div>

            </div>
        </>
    );
}

export default CreateNew;


interface CreateNewButtonProps {
    className: string;
    onClick: any;
    children: any;
}

const CreateNewButton: FC<CreateNewButtonProps> = ({ className, onClick, children }) => {
    return (
        <button onClick={onClick} className={`flex flex-col justify-center items-center gap-1 rounded-2xl w-20 h-24 ${className}`}>
            {children}
        </button>
    );
}
