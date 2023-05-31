/**
 * A component to test notes functions
 * Also contains the useNotebook hook to access notebook data and states
 * 
 */

'use client';

import { FC, useEffect, useState } from "react";
import { Note } from "@/types/typings";
import { TbTrash } from "react-icons/tb";

import { AppwriteIds, client, databases } from "@/lib/appwrite-config";
import { Permission, Query, Role } from "appwrite";

import { useUser } from "@/context/SessionContext";
import { useNotebook } from "@/context/NotebookContext";
import { useDocumentCreate } from "@/hooks";


interface NotesTestProps {

}

/**
 * Notes
 * Notes functions such as fetch and create.
 * 
 */

const NotesTest: FC<NotesTestProps> = () => {
    // States
    const [notes, setNotes] = useState<Note[] | null>(null)

    //Notebook data
    const { activeNotebookId } = useNotebook();

    //User data
    const { user } = useUser();

    //Fetch notes
    //
    const fetchNotes = async () => {

        try {
            // If no active notebook is found, cancel fetch.
            if (activeNotebookId === null) {
                return;
            }

            // Fetch user's notes
            const res = await databases.listDocuments(
                AppwriteIds.databaseId,
                AppwriteIds.collectionId_notes,
                [Query.equal('notebook_related', activeNotebookId)]
            );

            setNotes(res.documents as Note[]);

        } catch (error) {
            console.log(error);
        }
    }

    // Create a new note
    //
    const { createDocument } = useDocumentCreate(AppwriteIds.collectionId_notes);

    const createNote = async (title: string) => {
        // If we cannot find the relating notebook, cancel create.
        if (activeNotebookId === null) {
            return;
        }

        if (user) {
            createDocument({
                data: {
                    title: title,
                    body: "this is somebody",
                    notebook_related: activeNotebookId
                } as Note,
                permission: [
                    Permission.read(Role.user(user.$id)),
                    Permission.update(Role.user(user.$id)),
                    Permission.delete(Role.user(user.$id)),
                ]
            });
        }
    }

    // Use Effect triggers everytime a new notebook is selected.
    useEffect(() => {

        //Fetch Notes
        fetchNotes();

        // Subscribe to live changes for the user's notebook collection
        //
        const subscribe = client.subscribe(`databases.${AppwriteIds.databaseId}.collections.${AppwriteIds.collectionId_notes}.documents`,
            res => {
                // console.log("realtime triggered");
                fetchNotes();
            }
        );

        return () => {
            // Unsubscribe on unmount
            subscribe();
        }

    }, [activeNotebookId]);


    return (
        <>
            <div className="my-10">
                <button className="mx-3" onClick={() => createNote("A New Note")}>Create Note</button>
                {notes?.map((item) => (
                    <div key={item.$id} className={` cursor-pointer group flex justify-between items-center h-12 mb-4 border px-4 pr-2 rounded-lg 'border-neutral-700'}`}>
                        <h6 className="text-sm font-semibold">{item.title}</h6>
                        <div className="hidden group-hover:block">
                            <button className="text-danger py-2 px-2">
                                <TbTrash />
                            </button>
                        </div>
                    </div>
                ))}

            </div>
        </>
    );
}

export default NotesTest;