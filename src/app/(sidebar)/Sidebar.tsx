'use client';

import { Suspense, useCallback, useEffect, useState } from "react";
import { Note } from "@/types/typings";

import { AppwriteIds, client, databases } from "@/lib/appwrite-config";
import { Permission, Query, Role } from "appwrite";

import { useUser } from "@/context/SessionContext";
import { useNotebook } from "@/context/NotebookContext";
import { useDocumentCreate } from "@/hooks";

import { toast } from "react-hot-toast";


import NotebookSwitcher from "./components/NotebookSwitcher";
import NotesTest from "../workspace/components/NotesTest";
import NotebookTest from "../workspace/components/NotebookTest";
import NoteSwitcher from "./components/NoteSwitcher";
import LoadingComponent from "@/components/misc/Loading";

/**
 * TODO: 1. Notebook switcher - button with dropdown to switch notebooks
 * TODO: 2. Note switcher
 * TODO: 3. Note single page
 * TODO: 
 */

const Sidebar = () => {

    // States
    //
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [noteList, setNoteList] = useState<Note[] | null>(null)


    // User Data
    //
    const { user } = useUser();


    // Notebook Data
    //
    const { activeNotebookId } = useNotebook();


    // Fetch Notes
    const fetchNoteList = useCallback(async () => {

        setIsLoading(true);

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

            setNoteList(res.documents as Note[]);

        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }

    }, [activeNotebookId]);





    // Use effect
    //
    useEffect(() => {

        //Fetch Notes
        fetchNoteList();

        // Subscribe to live changes for the user's notebook collection
        const subscribe = client.subscribe(`databases.${AppwriteIds.databaseId}.collections.${AppwriteIds.collectionId_notes}.documents`, res => {
            fetchNoteList();
        });

        return () => {
            // Unsubscribe on unmount
            subscribe();
        }

    }, [fetchNoteList]);









    return (
        <aside className={`fixed top-0 left-0 z-40 w-80 h-full border-r border-border-color bg-background`}>

            <NotebookSwitcher />

            <div className="px-3 mt-8">
                <NoteSwitcher noteList={noteList} />

            </div>


            {/* <NotebookTest /> */}
            {/* <NotesTest /> */}
        </aside>
    );
}

export default Sidebar;