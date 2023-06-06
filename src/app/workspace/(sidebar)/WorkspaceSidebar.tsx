'use client';

import { useCallback, useEffect, useState } from "react";
import { usePathname } from 'next/navigation';

import { Note } from "@/types/typings";
import { useGlobalState } from "@/utils/global-states";

import { AppwriteIds, account, client, databases } from "@/lib/appwrite-config";
import { Permission, Query, Role } from "appwrite";

import { useUser } from "@/context/SessionContext";
import { useNotebook } from "@/context/NotebookContext";
import { useDocumentCreate } from "@/hooks";

import { toast } from "react-hot-toast";




import NotebookSwitcher from "./components/NotebookSwitcher";
// import NotesTest from "../workspace/components/NotesTest";
import NotebookTest from "../components/NotebookTest";
import NoteSwitcher from "./components/NoteSwitcher";
import LoadingComponent from "@/components/misc/Loading";
import { Button } from "@/components";

// Sidebar Components
import Status from "./components/Status";
import Filters from "./components/Filters";
import CreateNew from "./components/CreateNew";
import SearchButton from "./components/SearchButton";
import { NoteFilter, NoteStatus } from "@/types/enums";


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

            // Fetch user's notes
            const res = await databases.listDocuments(
                AppwriteIds.databaseId,
                AppwriteIds.collectionId_notes,
                [
                    Query.equal('notebook_related', activeNotebook.$id),
                    Query.orderDesc('$createdAt')
                ]
            )

            console.log(res);


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

    }, [activeNotebook]);


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

                <div onClick={() => setNotebookDropdown(!notebookDropdown)} className={`absolute w-full h-full cursor-zoom-out backdrop-blur-sm bg-black/10 transition-all ${!notebookDropdown ? 'invisible opacity-0' : 'visible opacity-100 z-40'}`}>
                    &nbsp;
                </div>

                <NotebookSwitcher className={`relative ${!notebookDropdown ? '' : 'z-50'}`} />



                <div className="relative flex items-center gap-2 pb-3 px-3 border-b border-border-light z-40">
                    <Status noteFilter={noteFilter} setNoteStatus={setNoteFilter} />
                    <SearchButton />
                    <Filters />
                    <CreateNew />
                </div>

                <div className={`relative px-3 mt-4 transition-opacity ${!notebookDropdown ? '' : 'z-30 opacity-10'}`}>
                    <NoteSwitcher noteList={noteList} noteFilter={noteFilter} />
                </div>


                {/* <NotebookTest /> */}
                {/* <NotesTest /> */}
            </div>
        </aside >
    );
}

export default WorkspaceSidebar;