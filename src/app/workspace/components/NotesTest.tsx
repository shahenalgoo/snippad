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
import { NoteStatus, NoteType } from "@/types/enums";


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

            // Temp code: use to delete bloated notebooks
            //
            // res.documents.forEach(element => {
            //     databases.deleteDocument(AppwriteIds.databaseId, AppwriteIds.collectionId_notes, element.$id)
            // });

            setNotes(res.documents as Note[]);

        } catch (error) {
            console.log(error);
        }
    }

    // Create a new note
    //
    const { createDocument } = useDocumentCreate(AppwriteIds.collectionId_notes);

    const createNote = async () => {
        // If we cannot find the relating notebook, cancel create.
        if (activeNotebookId === null) {
            return;
        }

        if (user) {
            try {

            } catch (error) {

            }
            createDocument({
                data: {
                    title: "This is a title",
                    subtitle: "Fuck a subtitle",
                    body: "This is somebody",
                    notebook_related: activeNotebookId,
                    type: NoteType.note,
                    starred: false,
                    status: NoteStatus.published
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
                <button className="mx-3" onClick={createNote}>Create Note</button>
            </div>
        </>
    );
}

export default NotesTest;