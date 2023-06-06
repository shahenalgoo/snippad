'use client';

// React
import { useCallback, useEffect, useState } from "react";
import { usePathname } from 'next/navigation';

// Typings
import { Note } from "@/types/typings";
import { NoteFilter, NoteStatus } from "@/types/enums";

// Appwrite
import { AppwriteIds, client, databases } from "@/lib/appwrite-config";
import { Query } from "appwrite";

// Hooks
import { useUser } from "@/context/SessionContext";
import { useNotebook } from "@/context/NotebookContext";

// Utils
import { useGlobalState } from "@/utils/global-states";

// Sidebar Components
import NotebookSwitcher from "./components/NotebookSwitcher";
import Status from "./components/Status";
import Filters from "./components/Filters";
import CreateNew from "./components/CreateNew";
import SearchButton from "./components/SearchButton";

import NotebookTest from "../components/NotebookTest";
import NoteSwitcher from "./components/NoteSwitcher";





const WorkspaceSidebar = () => {

    // States
    //
    const [sidebar, setSidebar] = useGlobalState("sidebar");
    const [notebookDropdown, setNotebookDropdown] = useGlobalState("notebookSwitcher");

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [noteList, setNoteList] = useState<Note[] | null>(null);
    const [noteFilter, setNoteFilter] = useState<NoteFilter>(NoteFilter.all);


    // Hooks
    //
    const pathname = usePathname();
    const { user } = useUser();
    const { activeNotebook } = useNotebook();


    // Fetch Notes
    //
    const fetchNoteList = useCallback(async () => {

        setIsLoading(true);



        try {

            // If no active notebook is found, cancel fetch.
            if (activeNotebook === null) {
                return;
            }

            // Fetching notes for the active notebook + active status (published, archived or trashed)
            let queries: string[] = [
                Query.equal('notebook_related', activeNotebook.$id),
                Query.equal('status', getFetchNoteStatus()),
                Query.orderDesc('$createdAt')
            ]

            // Add starred to the query if filter is set to starred
            if (noteFilter === NoteFilter.starred) {
                queries.push(
                    Query.equal('starred', true),
                );
            }

            // Fetch user's notes
            const res = await databases.listDocuments(
                AppwriteIds.databaseId,
                AppwriteIds.collectionId_notes,
                queries
            )

            // Temp code: use to quick delete while developing
            // res.documents.forEach(element => {
            //     databases.deleteDocument(AppwriteIds.databaseId, AppwriteIds.collectionId_notes, element.$id)
            // });

            setNoteList(res.documents as Note[]);

        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }

    }, [activeNotebook, noteFilter]);


    // Get note status according to the filter set    
    //
    function getFetchNoteStatus() {
        switch (noteFilter) {
            case NoteFilter.all:
                return NoteStatus.published
                break;
            case NoteFilter.starred:
                return NoteStatus.published
                break;
            case NoteFilter.archived:
                return NoteStatus.archived
                break;
            case NoteFilter.trash:
                return NoteStatus.trashed
                break;
            default:
                return NoteStatus.published
                break;
        }
    }



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

            <div className={`fixed top-0 z-50 w-80 xl:w-96 h-full transition-all ${!sidebar ? 'invisible lg:visible -left-80 lg:left-0' : 'visible left-0'} bg-white lg:border-r border-border-light`}>

                <div onClick={() => setNotebookDropdown(!notebookDropdown)} className={`absolute w-full h-full cursor-zoom-out backdrop-blur-sm bg-black/10 transition-all ${!notebookDropdown ? 'invisible opacity-0' : 'visible opacity-100 z-40'}`}>
                    &nbsp;
                </div>

                <NotebookSwitcher className={`relative ${!notebookDropdown ? '' : 'z-50'}`} />

                <div className="relative flex items-center gap-2 py-2 px-3 border-b border-t border-border-light z-40">
                    <Status noteFilter={noteFilter} setNoteFilter={setNoteFilter} />
                    <SearchButton />
                    <Filters />
                    <CreateNew />
                </div>

                <div className={`sidebar-notes-overflow relative h-[calc(100%_-_120px)] overflow-scroll py-4 px-3 transition-opacity ${!notebookDropdown ? '' : 'z-30 opacity-10'}`}>
                    <NoteSwitcher noteList={noteList} noteFilter={noteFilter} />
                </div>


                {/* <NotebookTest /> */}
                {/* <NotesTest /> */}
            </div>
        </aside >
    );
}

export default WorkspaceSidebar;