'use client';

// React
import React, { FC, useState, useRef, useEffect } from "react";

// Typings
import { Note, Notebook } from "@/types/typings";

// Hooks
import { useNotebook } from "@/context/NotebookContext";
import { useDocumentDelete, useDocumentUpdate, useToggle } from "@/hooks";

// Icons
import { TbArrowsLeftRight, TbDeviceFloppy, TbEdit, TbNotebook, TbPlus, TbTrash, TbTrashX, TbX } from "react-icons/tb";

//Components
import { Box, Button, Spinner } from "@/components";
import { ConfirmationModal } from "@/components/misc/ConfirmationModal";

// Utils
import { toast } from "react-hot-toast";
import { containsMinChars, containsOnlySpaces, containsSpecialChars } from "@/utils/form-validation";

// Appwrite
import { AppwriteIds, databases } from "@/lib/appwrite-config";
import { Query } from "appwrite";



/**
 * NOTEBOOK CARD
 * 
 */
interface NotebookCardProps {
    notebook: Notebook
}

const NotebookCard: FC<NotebookCardProps> = ({ notebook }) => {

    // States
    //
    const [canEdit, setCanEdit] = useState<boolean>(false);
    const [notebookTitle, setNotebookTitle] = useState<string>(notebook.title);
    const [modalActive, setModalActive] = useToggle();

    // Hooks
    //
    const ref = useRef<any>(null);
    const { isLoading, updateDocument } = useDocumentUpdate(AppwriteIds.collectionId_notebook);
    const { activeNotebook, defaultNotebookName, defaultNotebook, deleteNotebook, allNotes } = useNotebook();
    const { deleteDocument: deleteNote } = useDocumentDelete(AppwriteIds.collectionId_notes);
    const { updateDocument: updateNote } = useDocumentUpdate(AppwriteIds.collectionId_notes);

    const onFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNotebookTitle(e.target.value);
    }

    const onCancel = () => {
        setNotebookTitle(notebook.title);
        setCanEdit(!canEdit);

        const element = document.getElementById("title") as HTMLInputElement;
        if (element) element.value = notebook.title;
    }

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Title cannot be empty
        if (notebookTitle === null || notebookTitle === "") {
            return toast.error('Type something... 😓')
        };

        // Title cannot contain only spaces
        if (containsOnlySpaces(notebookTitle)) {
            return toast.error('Query cannot contain only spaces');
        }

        // Title must contain at least 3 characters
        if (containsMinChars(notebookTitle, 3)) {
            return toast.error('Must contain at least 3 characters');
        }

        // Title cannot contain special characters
        if (containsSpecialChars(notebookTitle)) {
            return toast.error('Cannot contain special characters');
        }

        //Title cannot be the same name as default General notebook
        if (notebookTitle === defaultNotebookName) {
            return toast.error('This notebook already exists');
        }

        updateDocument({
            document_id: notebook.$id,
            data: {
                title: notebookTitle
            } as Notebook,
            onSuccess() {
                setCanEdit(false);
                toast.success("Successfully renamed");
            },
            onError() {
                toast.error("Unable to rename");
            },
        });

    }

    // Delete Notebook and notes
    const onDelete = async (moveNotes?: boolean) => {
        let targetNotes: Note[] | null = null;

        // If active notebook is delete target, we can use allNotes. Else we have to fetch.
        if (activeNotebook?.$id == notebook.$id) {
            targetNotes = allNotes;
        } else {
            const response = await databases.listDocuments(
                AppwriteIds.databaseId,
                AppwriteIds.collectionId_notes,
                [Query.equal("notebook_related", notebook.$id)]
            );

            targetNotes = response.documents as Note[];
        }

        // Send to General, else delete all
        if (moveNotes) {
            targetNotes?.forEach(async element => {
                await updateNote({
                    document_id: element.$id,
                    data: {
                        notebook_related: defaultNotebook?.$id
                    } as Note
                }
                );
            });
        } else {
            targetNotes?.forEach(async element => {
                await deleteNote({ document_id: element.$id });
            });
        }

        deleteNotebook(notebook.$id);
    }

    useEffect(() => {
        if (ref && ref.current && canEdit === true) {
            ref.current.focus();
        }
    }, [canEdit, ref]);


    return (
        <Box variant='border' rounded='default' className={`py-0 mb-4 last:mb-0 transition-all ${canEdit ? 'border-primary' : ''}`}>
            <form onSubmit={onSubmit} className="flex items-center justify-between">
                <div className="flex-1 flex items-center text-sm font-semibold">
                    <TbNotebook size={24} strokeWidth={1} className="mr-2 " />

                    <input
                        id="title"
                        type="text"
                        defaultValue={notebook.title}
                        onChange={onFieldChange}
                        disabled={!canEdit}
                        ref={ref}
                        className="w-full h-14 outline-none disabled:bg-transparent"
                    />

                </div>

                <div className="flex gap-2">
                    {!canEdit &&
                        <>
                            <Button type="button" onClick={() => setCanEdit(!canEdit)} variant='gray' size='square'>
                                <TbEdit size={20} strokeWidth={1} />
                            </Button>

                            <ConfirmationModal
                                confirmationMessage={
                                    <p>All notes in <span className="font-extrabold">{notebookTitle || 'this item'}</span> will be deleted.</p>
                                }
                                confirmationButton={
                                    <>
                                        <Button variant='primary' type="button" onClick={() => onDelete(true)}>
                                            <TbArrowsLeftRight size={20} strokeWidth={1.5} className="mr-2" />
                                            Send All to General
                                        </Button>
                                        <Button variant='danger' type="button" onClick={() => onDelete(false)}>
                                            <TbTrashX size={20} strokeWidth={1.5} className="mr-2" />
                                            Delete All
                                        </Button>
                                    </>
                                }
                                modalButton={
                                    <Button onClick={() => setModalActive(!modalActive)} type="button" variant='gray' size='square'>
                                        <TbTrash size={20} strokeWidth={1} />
                                    </Button>
                                }
                                modalActive={modalActive}
                                setModalActive={setModalActive}
                            />
                        </>
                    }
                    {canEdit &&
                        <>
                            <Button type="button" onClick={onCancel} variant='gray' size='square'>
                                <TbX size={20} strokeWidth={1} />
                            </Button>

                            <Button type="submit" size='square'>
                                {!isLoading && <TbDeviceFloppy size={20} strokeWidth={1.5} />}
                                {isLoading && <Spinner variant='button' />}
                            </Button>

                        </>
                    }
                </div>
            </form>
        </Box>
    );
}


/**
 * EXPORTED PARENT COMPONENT
 */
const SettingsPage: FC = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { collection: notebookList, total: notebookCount, createNotebook } = useNotebook();

    // Create new notebook
    const onCreate = async () => {
        setIsLoading(true);
        await createNotebook("Untitled");
        setIsLoading(false);
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold">My Notebooks ({notebookCount}/3)</h2>
                <Button onClick={onCreate} rounded='full' disabled={isLoading}>
                    {!isLoading && <TbPlus size={20} className="mr-2 mt-[1px]" />}
                    {isLoading && <Spinner variant='button' className="mr-2" />}
                    Create New
                </Button>

            </div>

            {/* General Notebook - not editable */}
            {notebookList &&
                <Box variant='border' rounded='default' className={`py-0 mb-4 last:mb-0`}>
                    <div className="flex-1 flex items-center h-14 text-sm font-semibold">
                        <TbNotebook size={24} strokeWidth={1} className="mr-2" />
                        {notebookList[0].title}
                    </div>
                </Box>
            }

            {/* Other Notebooks - editable */}
            {notebookList?.slice(1).map((notebook: Notebook) => (
                <NotebookCard key={notebook?.$id} notebook={notebook} />
            ))}
        </div>
    );
}

export default SettingsPage;








