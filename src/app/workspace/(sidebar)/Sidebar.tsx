/**
 * Parent component for the sidebar
 * - Fetch notes
 * 
 * - Contains Notebook List & Selector
 * - Contains Options bar (filter, search, sort, create new)
 * - Contains Note List/Switcher
 */

'use client';

// React
import { useCallback, useEffect, useState } from "react";

// Typings
import { Note } from "@/types/typings";
import { NoteFilter, NoteStatus } from "@/types/enums";

// Appwrite
import { AppwriteIds, client, databases } from "@/lib/appwrite-config";
import { Query } from "appwrite";

// Hooks
import { useNotebook } from "@/context/NotebookContext";

// Sidebar Components
import Notebooks from "./Notebooks";
import OptionsBar from "./OptionsBar";
import NoteSwitcher from "./Notes";
import SidebarWrapper from "./components/Wrapper";


const Sidebar = () => {

    // States
    //
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [noteList, setNoteList] = useState<Note[] | null>(null);
    const [noteFilter, setNoteFilter] = useState<NoteFilter>(NoteFilter.all);


    // Hooks
    //
    const { activeNotebook } = useNotebook();


    /**
     * FETCH NOTES AND SET STATES
     * 
     */

    // Get note status according to the filter set    
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

    // Fetch Notes
    const fetchNoteList = useCallback(async () => {
        setIsLoading(true);
        try {

            // If no active notebook is found, cancel fetch.
            if (activeNotebook === null) return

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


    // Use effect
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
        <SidebarWrapper>

            <Notebooks />
            <OptionsBar noteFilter={noteFilter} setNoteFilter={setNoteFilter} />
            <NoteSwitcher noteList={noteList} noteFilter={noteFilter} />

        </SidebarWrapper>
    );
}

export default Sidebar;