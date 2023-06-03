'use client';

import { useCallback, useEffect, useState } from "react";
import { Note } from "@/types/typings";
import { useGlobalState } from "@/utils/global-states";

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

const WorkspaceSidebar = () => {

    // States
    //
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [noteList, setNoteList] = useState<Note[] | null>(null);
    const [sidebar, setSidebar] = useGlobalState("sidebar");


    // User Data
    //
    const { user } = useUser();


    // Notebook Data
    //
    const { activeNotebookId } = useNotebook();


    // Fetch Notes
    //
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

            // Temp code: use to quick delete while developing
            //
            // res.documents.forEach(element => {
            //     databases.deleteDocument(AppwriteIds.databaseId, AppwriteIds.collectionId_notes, element.$id)
            // });

            setNoteList(res.documents as Note[]);

        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }

    }, [activeNotebookId]);


    // Set sidebar to false on breakpoint
    //
    const handleResize = useCallback(() => {
        if (window.innerWidth > 1023) {
            setSidebar(false)
        }
    }, [setSidebar]);


    // Use effect
    //
    useEffect(() => {

        // Resize event
        window.addEventListener("resize", handleResize);

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

    }, [handleResize, fetchNoteList]);

    return (
        <aside>
            <button onClick={() => setSidebar(!sidebar)} className={`lg:!hidden fixed top-0 left-0 z-40 w-full h-full transition-all backdrop-blur-sm ${!sidebar ? 'invisible bg-black/0' : 'visible bg-black/60'}`}>
                &nbsp;
            </button>

            <div className={`fixed top-0 z-50 w-80 xl:w-96 h-full transition-all ${!sidebar ? 'invisible lg:visible -left-80 lg:left-0' : 'visible left-0'} bg-white lg:border-r border-slate-200`}>

                <NotebookSwitcher />

                <div className="px-3 mt-4">
                    <NoteSwitcher noteList={noteList} />
                </div>


                {/* <NotebookTest /> */}
                <NotesTest />
            </div>
        </aside >
    );
}

export default WorkspaceSidebar;