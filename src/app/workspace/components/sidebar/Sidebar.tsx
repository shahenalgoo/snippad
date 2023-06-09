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
import { NoteFilter, NoteStatus, NoteType, NotebookType, SortDate } from "@/types/enums";

// Appwrite
import { AppwriteIds, client, databases } from "@/lib/appwrite-config";
import { Query } from "appwrite";

// Hooks
import { useNotebook } from "@/context/NotebookContext";

// Sidebar Components
import NotebookSwitcher from "./NotebookSwitcher";
import OptionsBar from "./options-bar/OptionsBar";
import NoteSwitcher from "./NoteSwitcher";
import SidebarWrapper from "./Wrapper";


const Sidebar = () => {

    // States
    //
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [noteList, setNoteList] = useState<Note[] | null>(null);
    const [noteFilter, setNoteFilter] = useState<NoteFilter>(NoteFilter.all);
    const [sortDate, setSortDate] = useState<string>("latest");
    const [sortType, setSortType] = useState<string>("all");
    const [sortLanguage, setSortLanguage] = useState<string>("all");

    // Hooks
    //
    const { activeNotebook } = useNotebook();


    /**
     * FETCH NOTES AND SET STATES
     * Get note status according to the filter set    
     * 
     */
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
            if (!activeNotebook) return

            // Fetching notes for the active notebook + active status (published, archived or trashed)
            let queries: string[] = [
                Query.equal('notebook_related', activeNotebook.type === NotebookType.personal ? activeNotebook.$id : NotebookType.shared),
                Query.equal('status', getFetchNoteStatus()),
            ]

            // Sort by latest/oldest
            if (sortDate === SortDate.latest) {
                queries.push(Query.orderDesc('$createdAt'));
            } else {
                queries.push(Query.orderAsc('$createdAt'));

            }

            // Add starred to the query if filter is set to starred
            if (noteFilter === NoteFilter.starred) {
                queries.push(Query.equal('starred', true),);
            }

            // Sort by type
            if (sortType !== "all") {
                queries.push(Query.equal('type', sortType));
            }

            // Sort by language
            if (sortType === NoteType.code && sortLanguage !== "all") {
                queries.push(Query.equal('snippet_language', sortLanguage));

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

    }, [activeNotebook, noteFilter, sortDate, sortType, sortLanguage]);


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

            <NotebookSwitcher />

            <OptionsBar
                noteFilter={noteFilter}
                setNoteFilter={setNoteFilter}

                sortDate={sortDate}
                setSortDate={setSortDate}

                sortType={sortType}
                setSortType={setSortType}

                sortLanguage={sortLanguage}
                setSortLanguage={setSortLanguage}
            />

            <NoteSwitcher noteList={noteList} noteFilter={noteFilter} />

        </SidebarWrapper>
    );
}

export default Sidebar;