'use client';

// React
import React, { FC, useState, useRef, useEffect } from "react";

// Typings
import { Notebook } from "@/types/typings";

// Hooks
import { useNotebook } from "@/context/NotebookContext";

// Icons
import { TbDeviceFloppy, TbEdit, TbNotebook, TbPlus, TbTrash, TbTrashX, TbTrashXFilled, TbX } from "react-icons/tb";
import { Box, Button, Modal, Spinner } from "@/components";
import { useDocumentUpdate, useToggle } from "@/hooks";
import { toast } from "react-hot-toast";
import { AppwriteIds } from "@/lib/appwrite-config";



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

    // console.log(notebookTitle);


    // Hooks
    //
    const ref = useRef<any>(null);
    const { isLoading, updateDocument } = useDocumentUpdate(AppwriteIds.collectionId_notebook);

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

                            <DeleteModal
                                notebookTitle={notebook.title}
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
 * DELETE MODAL
 * 
 */
interface DeleteModalProps {
    notebookTitle: string;
}

const DeleteModal: FC<DeleteModalProps> = ({ notebookTitle }) => {

    const [modalActive, setModalActive] = useToggle();

    return (
        <>
            <Button onClick={() => setModalActive(!modalActive)} type="button" variant='gray' size='square'>
                <TbTrash size={20} strokeWidth={1} />
            </Button>

            <Modal title="Are you sure?" modalActive={modalActive} onClose={() => setModalActive(!modalActive)} closeButton={false} closeWithBackdrop={false}>
                <div className="p-4 pt-0">
                    <p>All notes in <span className="font-extrabold">{notebookTitle || 'this notebook'}</span> will be deleted.</p>

                    <div className="mt-8 flex justify-end gap-2">
                        <Button onClick={() => setModalActive(!modalActive)} variant='gray'>Cancel</Button>
                        <Button variant='danger'>
                            <TbTrashX size={20} strokeWidth={1.5} className="mr-2" />
                            Delete Permanently
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
}



/**
 * EXPORTED PARENT COMPONENT
 */
const SettingsPage: FC = () => {

    const { collection: notebookList, total: notebookCount, createNotebook } = useNotebook();

    const onCreate = () => {
        alert("created new")
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold">My Notebooks ({notebookCount}/3)</h2>
                <Button onClick={onCreate} rounded='full'>
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








