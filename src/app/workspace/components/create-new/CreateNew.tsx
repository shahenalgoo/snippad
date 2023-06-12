'use client';

// React
import { FC, MouseEventHandler } from "react";
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
import { TbNotes, TbCode, TbPlus, TbHandRock } from "react-icons/tb";
import toast from "react-hot-toast";
import { Button } from "@/components";

interface CreateNewProps {

}

const CreateNew: FC<CreateNewProps> = () => {

    // Init router
    //
    const router = useRouter();

    //Notebook data
    const { activeNotebook, allNotes, fetchNotes, total: notebookCount, isLoading: isLoadingNotebook, createNotebook } = useNotebook();


    //User data
    const { user } = useUser();


    // Notes limit in a notebook
    const notesLimit = 30;


    // Create a new note
    //
    const { createDocument } = useDocumentCreate(AppwriteIds.collectionId_notes);

    const createNote = async (type: NoteType) => {

        // If we cannot find the relating notebook or all notes or user, cancel create.
        if (!activeNotebook || !allNotes || !user) {
            return;
        }

        // If note limit has been reached, inform user
        if (allNotes?.length >= notesLimit) {
            toast.error("Notes limit reached in " + activeNotebook.title);
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
                    status_last_update: new Date(),
                    snippet_language: 'html',
                    search_index: ''
                } as Note,
                permission: [
                    Permission.read(Role.user(user?.$id)),
                    Permission.update(Role.user(user?.$id)),
                    Permission.delete(Role.user(user?.$id)),
                ],
                onSuccess() {
                    fetchNotes();
                }
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

                {/* Create First Notebook */}
                {!isLoadingNotebook && notebookCount === 0 &&
                    <>
                        <div className="mb-4 w-20 h-20 rounded-full flex justify-center items-center bg-slate-100 text-neutral-500">
                            <TbHandRock size={50} strokeWidth={0.5} />
                        </div>
                        <h1 className="mb-1 text-2xl font-bold">Welcome to Snippad!</h1>
                        <p className="mb-6">
                            Create your first notebook <span className="hidden lg:inline">in the sidebar.</span>
                        </p>
                        <Button onClick={() => createNotebook("", true)} variant='black' size='full' className="lg:hidden max-w-[300px]">
                            <TbPlus size={24} strokeWidth={1.5} className="mr-2" />
                            Create First Notebook
                        </Button>
                    </>
                }

                {/* Create new notes */}
                {allNotes && allNotes.length < notesLimit &&
                    <>
                        <h1 className="mb-8 text-xl text-black dark:text-white font-semibold">Create New</h1>

                        <div className="flex gap-6">
                            <CreateNewButton className="bg-blue-900" onClick={() => createNote(NoteType.code)}>
                                <TbCode size={30} strokeWidth={1} />
                                Code
                            </CreateNewButton>
                            <CreateNewButton className="bg-emerald-800" onClick={() => createNote(NoteType.note)}>
                                <TbNotes size={30} strokeWidth={1} />
                                Note
                            </CreateNewButton>
                        </div>
                    </>
                }

                {/* Note limit reached */}
                {allNotes && allNotes.length >= notesLimit &&
                    <h1 className="text-lg text-danger">Notes limit reached in {activeNotebook?.title}</h1>
                }

            </div>
        </>
    );
}

export default CreateNew;


interface CreateNewButtonProps {
    className: string;
    onClick: MouseEventHandler<HTMLButtonElement>;
    children: React.ReactNode;
}

const CreateNewButton: FC<CreateNewButtonProps> = ({ className, onClick, children }) => {
    return (
        <button onClick={onClick} className={`flex flex-col justify-center items-center gap-1 rounded-2xl w-20 h-24 text-white ${className}`}>
            {children}
        </button>
    );
}
